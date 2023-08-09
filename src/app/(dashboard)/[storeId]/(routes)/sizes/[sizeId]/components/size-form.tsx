'use client'

import * as z from 'zod'
import { Size } from '@prisma/client'
import { Trash } from 'lucide-react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-hot-toast'
import { useParams, useRouter } from 'next/navigation'
import axios from 'axios'

import { Heading } from '@/components/ui/heading'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { AlertModal } from '@/components/modals/alert-modal'
import ImageUpload from '@/components/ui/image-upload'
import { Input } from '@/components/ui/input'

const formSchema = z.object({
    name: z.string().min(1, {
        message: 'El nombre debe contener al menos un caracter'
    }),
    value: z.string().min(1, {
        message: 'la talla debe contener al menos un caracter'
    })
})

type SizeFormValues = z.infer<typeof formSchema>

interface SizeFormProps {
    initialData: Size | null
}

export const SizeForm: React.FC<SizeFormProps> = ({
    initialData
}) => {

    const params = useParams()
    const router = useRouter()

    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)

    const title = initialData ? "Editar talla" : "Crear talla"
    const description = initialData ? "Editar talla" : "Agregar una nueva talla"
    const toastMessage = initialData ? "Talla actualizada" : "Talla creada"
    const action = initialData ? "Guardar cambios" : "Guardar"

    const form = useForm<SizeFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData || {
            name: '',
            value: ''
        }
    })

    const onSubmit = async (data: SizeFormValues) => {
        try {
            setLoading(true)
            if (initialData) {
                await axios.patch(`/api/${params.storeId}/sizes/${params.sizeId}`, data)
            } else {
                await axios.post(`/api/${params.storeId}/sizes`, data)
            }
            router.refresh()
            router.push(`/${params.storeId}/sizes`)
            toast.success(toastMessage)
        } catch (error) {
            toast.error('Algo salió mal')
        } finally {
            setLoading(false)
        }
    }

    const onDelete = async () => {
        try {
            setLoading(true)
            await axios.delete(`/api/${params.storeId}/sizes/${params.sizeId}`)
            router.refresh()
            router.push(`/${params.storeId}/sizes`)
            toast.success('Talla eliminada')
        } catch (error) {
            toast.error('Asegúrate de eliminar todos los productos que utilicen esta talla primero')
        } finally {
            setLoading(false)
            setOpen(false)
        }
    }

    return (
        <>
            <AlertModal isOpen={open} onClose={() => setOpen(false)} onConfirm={onDelete} loading={loading} />
            <div className='flex items-center justify-between'>
                <Heading title={title} description={description} />
                {initialData && (
                    <Button disabled={loading} variant='destructive' size='sm' onClick={() => setOpen(true)}>
                        <Trash className='h-4 w-4' />
                    </Button>
                )}
            </div>
            <Separator />
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8 w-full'> {/* este form es el nativo de html */}
                    <div className='grid grid-cols-3 gap-8'>
                        <FormField control={form.control} name='name' render={({ field }) => (
                            <FormItem>
                                <FormLabel>Nombre</FormLabel>
                                <FormControl>
                                    <Input disabled={loading} placeholder='Descripción de la talla' {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <FormField control={form.control} name='value' render={({ field }) => (
                            <FormItem>
                                <FormLabel>Talla</FormLabel>
                                <FormControl>
                                    <Input disabled={loading} placeholder='Escriba la talla' {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                    </div>
                    <Button disabled={loading} className='ml-auto !mt-3' type='submit'>
                        {action}
                    </Button>
                </form>
            </Form>
        </>
    )
}