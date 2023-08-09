'use client'

import * as z from 'zod'
import { Billboard, Category } from '@prisma/client'
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
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import ImageUpload from '@/components/ui/image-upload'

const formSchema = z.object({
    name: z.string().min(1, {
        message: 'El nombre debe contener al menos un caracter'
    }),
    billboardId: z.string().min(1, {
        message: 'Debe contener un Billboard Id'
    }),
    imageUrl: z.string().min(1, {
        message: 'Debes seleccionar una imagen'
    })
})

type CategoryFormValues = z.infer<typeof formSchema>

interface CategoryFormProps {
    initialData: Category | null
    billboards: Billboard[]
}

export const CategoryForm: React.FC<CategoryFormProps> = ({
    initialData,
    billboards
}) => {

    const params = useParams()
    const router = useRouter()

    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)

    const title = initialData ? "Editar Categoría" : "Crear Categoría"
    const description = initialData ? "Edita una Categoría" : "Agrega una nuevo Categoría"
    const toastMessage = initialData ? "Categoría actualizada" : "Categoría creada"
    const action = initialData ? "Guardar cambios" : "Guardar"

    const form = useForm<CategoryFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData || {
            name: '',
            billboardId: '',
            imageUrl: ''
        }
    })

    const onSubmit = async (data: CategoryFormValues) => {
        try {
            setLoading(true)
            if (initialData) {
                await axios.patch(`/api/${params.storeId}/categories/${params.categoryId}`, data)
            } else {
                await axios.post(`/api/${params.storeId}/categories`, data)
            }
            router.refresh()
            router.push(`/${params.storeId}/categories`)
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
            await axios.delete(`/api/${params.storeId}/categories/${params.categoryId}`)
            router.refresh()
            router.push(`/${params.storeId}/categories`)
            toast.success('Categoría eliminada')
        } catch (error) {
            toast.error('Asegúrate de eliminar todos los productos usados en esta categoría primero')
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
                    <FormField control={form.control} name='imageUrl' render={({ field }) => (
                        <FormItem>
                            <FormLabel>Imagen de la categoría</FormLabel>
                            <FormControl>
                                <ImageUpload value={field.value ? [field.value] : []} disabled={loading} onChange={(url) => field.onChange(url)} onRemove={() => field.onChange('')} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />
                    <div className='grid grid-cols-3 gap-8'>
                        <FormField control={form.control} name='name' render={({ field }) => (
                            <FormItem>
                                <FormLabel>Nombre</FormLabel>
                                <FormControl>
                                    <Input disabled={loading} placeholder='Nombre de la Categoría' {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <FormField control={form.control} name='billboardId' render={({ field }) => (
                            <FormItem>
                                <FormLabel>Tablero</FormLabel>
                                    <Select disabled={loading} onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue defaultValue={field.value} placeholder="Selecciona un tablero" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {billboards.map((billboard) => (
                                                <SelectItem key={billboard.id} value={billboard.id}>
                                                    {billboard.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
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