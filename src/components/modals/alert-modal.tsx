'use client'

import { useEffect, useState } from "react"
import { Modal } from "@/components/ui/modal"
import { Button } from "@/components/ui/button"

interface AlertModalProps {
    isOpen: boolean
    onClose: () => void
    onConfirm: () => void
    loading: boolean
}

export const AlertModal: React.FC<AlertModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    loading
}) => {
    
    const [isMounted, setIsMounted] = useState(false)

    useEffect(() => {
        setIsMounted(true)
    }, [])

    if(!isMounted) {
        return null
    }

    return (
        <Modal title="¿Estás seguro/a de eliminar la tienda?" description="Recuerda que esta acción no se puede revertir" isOpen={isOpen} onClose={onClose}>
            <div className="pt-4 space-x-2 flex justify-end items-center w-full">
                <Button disabled={loading} variant='outline' onClick={onClose}>
                    Cancelar
                </Button>
                <Button disabled={loading} variant='destructive' onClick={onConfirm}>
                    Continuar
                </Button>
            </div>
        </Modal>
    )
}