import { toast } from "sonner";

export const useToast = () => {
    return {
        toast: (options: {
            title?: string;
            description?: string;
            variant?: "default" | "destructive" | "success" | "warning";
        }) => {
            if (options.variant === "destructive") {
                toast.error(options.title || "Error", {
                    description: options.description,
                });
            } else if (options.variant === "success") {
                toast.success(options.title || "Success", {
                    description: options.description,
                });
            } else if (options.variant === "warning") {
                toast.warning(options.title || "Warning", {
                    description: options.description,
                });
            } else {
                toast(options.title || "Notification", {
                    description: options.description,
                });
            }
        },
    };
};
