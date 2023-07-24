'use client'

import * as z from 'zod'
import { Billboard } from '@prisma/client'
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

const formSchema = z.object({
    imageOneUrl: z.string().min(1, {
        message: 'Debes seleccionar una imagen'
    }),
    imageTwoUrl: z.string().min(1, {
        message: 'Debes seleccionar una imagen'
    })
})

type BillboardFormValues = z.infer<typeof formSchema>

interface BillboardFormProps {
    initialData: Billboard | null
}

export const BillboardForm: React.FC<BillboardFormProps> = ({
    initialData
}) => {

    const params = useParams()
    const router = useRouter()

    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)

    const title = initialData ? "Editar Tablero" : "Crear tablero"
    const description = initialData ? "Editar tablero" : "Agregar un nuevo tablero"
    const toastMessage = initialData ? "Tablero actualizado" : "Tablero creado"
    const action = initialData ? "Guardar cambios" : "Crear"

    const form = useForm<BillboardFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData || {
            imageOneUrl: '',
            imageTwoUrl: ''
        }
    })

    const onSubmit = async (data: BillboardFormValues) => {
        try {
            setLoading(true)
            if (initialData) {
                await axios.patch(`/api/${params.storeId}/billboards/${params.billboardId}`, data)
            } else {
                await axios.post(`/api/${params.storeId}/billboards`, data)
            }
            router.refresh()
            router.push(`/${params.storeId}/billboards`)
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
            await axios.delete(`/api/${params.storeId}/billboards/${params.billboardId}`)
            router.refresh()
            router.push('/')
            toast.success('Tablero eliminado')
        } catch (error) {
            toast.error('Asegúrate de eliminar todas las categorías usadas en este tablero primero')
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
                <form onSubmit={form.handleSubmit(onSubmit)} className='w-full grid grid-cols-2'> {/* este form es el nativo de html */}
                    <FormField control={form.control} name='imageOneUrl' render={({ field }) => (
                        <FormItem className=''>
                            <FormLabel>Imagen de portada - Ropa</FormLabel>
                            <FormControl>
                                <ImageUpload value={field.value ? [field.value] : []} disabled={loading} onChange={(url) => field.onChange(url)} onRemove={() => field.onChange('')} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />
                    <FormField control={form.control} name='imageTwoUrl' render={({ field }) => (
                        <FormItem className=''>
                            <FormLabel>Imagen de portada - Productos</FormLabel>
                            <FormControl>
                                <ImageUpload value={field.value ? [field.value] : []} disabled={loading} onChange={(url) => field.onChange(url)} onRemove={() => field.onChange('')} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />
                    <div className='w-full'>
                        <Button disabled={loading} className='ml-auto !mt-6 w-auto' type='submit'>
                            {action}
                        </Button>
                    </div>
                </form>
            </Form>
            <Separator />
        </>
    )
}