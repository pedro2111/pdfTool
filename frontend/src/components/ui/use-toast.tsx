import * as React from "react"

const ToastContext = React.createContext<{
    toasts: { id: string; title?: string; description?: string; variant?: "default" | "destructive" }[];
    toast: (props: { title?: string; description?: string; variant?: "default" | "destructive" }) => void;
    dismiss: (id: string) => void;
}>({
    toasts: [],
    toast: () => { },
    dismiss: () => { },
})

export function ToastProvider({ children }: { children: React.ReactNode }) {
    const [toasts, setToasts] = React.useState<{ id: string; title?: string; description?: string; variant?: "default" | "destructive" }[]>([])

    const toast = ({ title, description, variant = "default" }: { title?: string; description?: string; variant?: "default" | "destructive" }) => {
        const id = Math.random().toString(36).substr(2, 9)
        setToasts((prev) => [...prev, { id, title, description, variant }])
        setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id))
        }, 3000)
    }

    const dismiss = (id: string) => {
        setToasts((prev) => prev.filter((t) => t.id !== id))
    }

    return (
        <ToastContext.Provider value={{ toasts, toast, dismiss }}>
            {children}
            <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
                {toasts.map((t) => (
                    <div
                        key={t.id}
                        className={`min-w-[300px] rounded-md border p-4 shadow-lg transition-all ${t.variant === "destructive" ? "bg-destructive text-destructive-foreground" : "bg-white text-black border-slate-200"
                            }`}
                    >
                        {t.title && <div className="font-semibold">{t.title}</div>}
                        {t.description && <div className="text-sm opacity-90">{t.description}</div>}
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    )
}

export const useToast = () => React.useContext(ToastContext)
