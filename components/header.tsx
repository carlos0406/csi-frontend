"use client";
import Link from "next/link";
import { useState } from "react";
import { ShoppingCart, User, ChevronDown } from "lucide-react";
import LoginModal from "./login-modal";
import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";
import Image from "next/image";

export default function Header({ user }: { user: any }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  return (
    <header className="bg-gray-900 text-white">
      <div className="container mx-auto px-3 sm:px-4 py-3 flex justify-between items-center">
        <Link href="/" className="font-bold text-lg">
          CSINatal
        </Link>

        <div className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-1 text-sm">
              <span>Olá, {user.name}</span>
              <Image
                className="hidden md:block rounded-full"
                src={user.image || "/placeholder.jpg"}
                height={30}
                width={30}
                alt="avatar"
              />
              <div className="relative">
                <button
                  className="flex items-center gap-1"
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                  <ShoppingCart className="h-5 w-5" />
                  <ChevronDown className="h-4 w-4" />
                </button>

                {isMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white text-gray-800 shadow-lg rounded-md py-1 z-10">
                    <Link
                      href="/minhas-compras"
                      className="block px-4 py-2 hover:bg-gray-100"
                    >
                      Minhas Compras
                    </Link>
                    <button
                      className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                      onClick={() => signOut()}
                    >
                      Sair
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <Button
              size="sm"
              className="flex items-center gap-1 h-10"
              onClick={() => setIsLoginModalOpen(true)}
            >
              <User className="h-4 w-4" />
              <span className="hidden sm:inline ">Login </span>
            </Button>
          )}
        </div>
      </div>

      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => {
          setIsLoginModalOpen(false);
        }}
      />
    </header>
  );
}
