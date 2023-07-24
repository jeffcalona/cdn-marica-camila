"use client"

import * as z from "zod"
import axios from "axios"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import { toast } from "react-hot-toast"

import { useStoreModal } from "@/hooks/use-store-modal"
import { Modal } from "@/components/ui/modal"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "../ui/button"

const formSchema = z.object({
    name: z.string().min(1)
})

export const StoreModal = () => {

    const storeModal = useStoreModal()

    const [loadingName, setLoadingName] = useState(false)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: ''
        }
    })

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            setLoadingName(true)

            const response = await axios.post('/api/stores', values)

            window.location.assign(`/${response.data.id}`) //esto lo que hace es hacer un refresh de la página, mientras me redirecciona a la del nuevo storeId. No utilizo el redict de next porque no me refresca la pantalla, y de esta manera no me mostrara lo que tengo cargado en la base de datos

        } catch (error) {
            toast.error('Algo salió mal')
        } finally {
            setLoadingName(false)
        }
    }

    return (
        <Modal
            title= "Crea una nueva tienda"
            description="Agrega una nueva tienda a tu CRM"
            isOpen={storeModal.isOpen}
            onClose={storeModal.onClose}
        >
            <div>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <FormField
                            control={form.control}
                            name='name'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nombre</FormLabel>
                                    <FormControl>
                                        <Input disabled={loadingName} placeholder="Nombre de la tienda" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}/>
                            <div className="py-4 w-full flex justify-end space-x-3">
                                <Button disabled={loadingName} variant="outline" onClick={storeModal.onClose}>Cancelar</Button>
                                <Button disabled={loadingName} type="submit">Continuar</Button>
                            </div>
                    </form>
                </Form>
            </div>
        </Modal>
    )
}