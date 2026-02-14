import { useState } from 'react';
import { Phone } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '../../../components/ui/dialog';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { Button } from '../../../components/ui/button';
import { validatePhoneNumber, openWhatsApp } from '../utils/whatsappUtils';
import type { SimulationData } from '../types';

interface ShareSimulationDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    simulationData: SimulationData;
}

export function ShareSimulationDialog({ open, onOpenChange, simulationData }: ShareSimulationDialogProps) {
    const [phone, setPhone] = useState('');
    const [error, setError] = useState('');

    const handleShare = () => {
        // Valida o número
        if (!validatePhoneNumber(phone)) {
            setError('Por favor, informe um número válido com DDD (mínimo 10 dígitos)');
            return;
        }

        // Abre o WhatsApp
        openWhatsApp(phone, simulationData);

        // Limpa e fecha o modal
        setPhone('');
        setError('');
        onOpenChange(false);
    };

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPhone(e.target.value);
        setError(''); // Limpa o erro ao digitar
    };

    const handleClose = () => {
        setPhone('');
        setError('');
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Phone className="w-5 h-5 text-blue-600" />
                        Compartilhar via WhatsApp
                    </DialogTitle>
                    <DialogDescription>
                        Informe o número de telefone do destinatário para compartilhar o resultado da simulação.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="phone">
                            Número de Telefone
                        </Label>
                        <Input
                            id="phone"
                            placeholder="(11) 98765-4321"
                            value={phone}
                            onChange={handlePhoneChange}
                            className={error ? 'border-red-500' : ''}
                        />
                        {error && (
                            <p className="text-sm text-red-500">{error}</p>
                        )}
                        <p className="text-xs text-slate-500">
                            Digite o número com DDD. Exemplo: 11987654321
                        </p>
                    </div>
                </div>
                <DialogFooter>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={handleClose}
                    >
                        Cancelar
                    </Button>
                    <Button
                        type="button"
                        onClick={handleShare}
                        className="bg-green-600 hover:bg-green-700"
                    >
                        <Phone className="w-4 h-4 mr-2" />
                        Enviar
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
