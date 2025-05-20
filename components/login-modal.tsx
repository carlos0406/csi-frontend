"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ChromeIcon as Google } from "lucide-react";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

import { signIn } from "next-auth/react";

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const handleGoogleLogin = async () => {
    signIn("google", {
      callbackUrl: "/",
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Login</DialogTitle>
          <DialogDescription>
            Faça login para acessar o sistema de compras
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col items-center justify-center py-6">
          <Button
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-2 h-12 sm:h-10"
            variant="outline"
          >
            <Google className="h-5 w-5" />
            <span>Continuar com Google</span>
          </Button>
          <p className="mt-4 text-sm text-gray-500 text-center sm:text-left">
            Ao fazer login, você concorda com nossos termos de serviço e
            política de privacidade.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
