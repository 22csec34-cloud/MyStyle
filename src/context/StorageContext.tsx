import React, { createContext, useContext, useEffect, useState } from 'react';
import { toast } from 'sonner';

export interface GeneratedImage {
    id: string;
    label: string;
    description: string;
    url: string | null;
    date?: string;
    viewType?: string;
}

export interface CartItem {
    id: string;
    label: string;
    image: string;
    price: number;
}

interface StorageContextType {
    savedImages: GeneratedImage[];
    cartItems: CartItem[];
    addToGallery: (image: GeneratedImage) => void;
    saveImageSet: (images: GeneratedImage[], description: string) => Promise<void>;
    addToCart: (item: CartItem) => void;
    removeFromCart: (id: string) => void;
    refreshGallery: () => void;
}

const StorageContext = createContext<StorageContextType | undefined>(undefined);

export const StorageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [savedImages, setSavedImages] = useState<GeneratedImage[]>([]);
    const [cartItems, setCartItems] = useState<CartItem[]>(() => {
        const saved = localStorage.getItem('style-weaver-cart');
        return saved ? JSON.parse(saved) : [];
    });

    const getToken = () => localStorage.getItem('token');

    const fetchGallery = async () => {
        const token = getToken();
        if (!token) return;

        try {
            const response = await fetch('http://localhost:5000/api/user/image-sets', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                const data = await response.json();
                // Transform image sets into flat array for display
                const allImages: GeneratedImage[] = [];
                data.forEach((set: any) => {
                    set.images.forEach((img: any, idx: number) => {
                        allImages.push({
                            id: `${set.setId || set._id}-${img.viewType}`,
                            label: img.label,
                            description: set.description || '',
                            url: img.url,
                            date: set.generatedAt || new Date().toISOString(),
                            viewType: img.viewType
                        });
                    });
                });
                setSavedImages(allImages.reverse());
            }
        } catch (error) {
            console.error("Failed to fetch gallery:", error);
        }
    };

    useEffect(() => {
        fetchGallery();
    }, []);

    const saveImageSet = async (images: GeneratedImage[], description: string) => {
        const token = getToken();
        if (!token) {
            toast.error("Please login to save images");
            return;
        }

        // Only save images that have URLs
        const validImages = images.filter(img => img.url);
        if (validImages.length === 0) return;

        try {
            const response = await fetch('http://localhost:5000/api/save-image-set', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    description,
                    images: validImages.map(img => ({
                        viewType: img.id, // using id as viewType (front, left, back, outfit)
                        url: img.url,
                        label: img.label
                    }))
                })
            });

            if (response.ok) {
                toast.success("Image set saved to Collection");
                fetchGallery(); // Refresh list
            } else {
                const err = await response.json();
                toast.error(`Failed to save: ${err.error}`);
            }
        } catch (error) {
            console.error("Storage Error:", error);
            toast.error("Network error saving image set");
        }
    };

    const addToGallery = async (image: GeneratedImage) => {
        const token = getToken();
        if (!token) {
            toast.error("Please login to save images");
            // You might want to redirect to login here
            return;
        }

        try {
            const response = await fetch('http://localhost:5000/api/save-gallery-image', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ imageUrl: image.url, label: image.label })
            });

            if (response.ok) {
                toast.success("Design saved to Collection");
                fetchGallery(); // Refresh list
            } else {
                const err = await response.json();
                toast.error(`Failed to save: ${err.error}`);
            }
        } catch (error) {
            console.error("Storage Error:", error);
            toast.error("Network error saving image");
        }
    };

    const addToCart = (item: CartItem) => {
        setCartItems((prev) => {
            if (prev.some(i => i.id === item.id)) {
                toast.info("Item already in cart");
                return prev;
            }
            toast.success(`Added ${item.label} to cart`);
            return [item, ...prev];
        });
    };

    const removeFromCart = (id: string) => {
        setCartItems((prev) => prev.filter(item => item.id !== id));
        toast.success("Removed from cart");
    };

    useEffect(() => {
        localStorage.setItem('style-weaver-cart', JSON.stringify(cartItems));
    }, [cartItems]);

    return (
        <StorageContext.Provider value={{ savedImages, cartItems, addToGallery, saveImageSet, addToCart, removeFromCart, refreshGallery: fetchGallery }}>
            {children}
        </StorageContext.Provider>
    );
};

export const useStorage = () => {
    const context = useContext(StorageContext);
    if (context === undefined) {
        throw new Error('useStorage must be used within a StorageProvider');
    }
    return context;
};
