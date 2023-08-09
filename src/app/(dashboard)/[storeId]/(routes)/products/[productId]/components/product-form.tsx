'use client'

import * as z from 'zod'
import { Billboard, Category, Color, Image, Product, ProductSize, Size } from '@prisma/client'
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
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { AlertModal } from '@/components/modals/alert-modal'
import ImageUpload from '@/components/ui/image-upload'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Textarea } from '@/components/ui/textarea'

const formSchema = z.object({
    name: z.string().min(1, {
        message: 'El nombre debe contener al menos un caracter'
    }),
    descriptionLong: z.string().min(1).max(500, {
        message: 'La descripción larga debe tener un mínimo de 1 y un máximo de 500 carácteres'
    }),
    descriptionSmall: z.string().min(1).max(50, {
        message: 'La descripción larga debe tener un mínimo de 1 y un máximo de 50 carácteres'
    }),
    images: z.object({ url: z.string() }).array(),
    price: z.coerce.number().min(1),
    categoryId: z.string().min(1),
    colorId: z.string().min(1),
    // sizes: z.object({ sizenew: z.string() }).array(),
    sizes: z.array(z.string()).refine((value) => value.some((item) => item), {
        message: "Tienes que seleccionar almenos una talla",
    }),
    billboardId: z.string().min(1),
})

type ProductFormValues = z.infer<typeof formSchema>

interface ProductFormProps {
    initialData: Product & {
        images: Image[],
        sizes: ProductSize[],
    } | null
    categories: Category[],
    colors: Color[],
    sizes: Size[],
    billboards: Billboard[]
}

export const ProductForm: React.FC<ProductFormProps> = ({
    initialData,
    categories,
    colors,
    sizes,
    billboards
}) => {

    const params = useParams()
    const router = useRouter()

    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)

    const title = initialData ? "Editar producto" : "Crear producto"
    const description = initialData ? "Editar producto" : "Agregar un nuevo producto"
    const toastMessage = initialData ? "Producto actualizado" : "Producto creado"
    const action = initialData ? "Guardar cambios" : "Guardar"

    const form = useForm<ProductFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData ? {
            ...initialData,
            price: parseFloat(String(initialData?.price)),
            sizes: initialData.sizes.map((size) => size.sizenew)
        } : {
            name: '',
            descriptionLong: '',
            descriptionSmall: '',
            images: [],
            price: 0,
            sizes: [],
            colorId: '',
            categoryId: '',
            billboardId: ''
        }
    })

    const onSubmit = async (data: ProductFormValues) => {
        try {
            setLoading(true)
            if (initialData) {
                await axios.patch(`/api/${params.storeId}/products/${params.productId}`, data)
            } else {
                await axios.post(`/api/${params.storeId}/products`, data)
            }
            router.refresh()
            router.push(`/${params.storeId}/products`)
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
            await axios.delete(`/api/${params.storeId}/products/${params.productId}`)
            router.refresh()
            router.push(`/${params.storeId}/products`)
            toast.success('Producto eliminado')
        } catch (error) {
            toast.error('Algo salió mal')
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
                    <FormField control={form.control} name='images' render={({ field }) => (
                        <FormItem>
                            <FormLabel>Imagenes</FormLabel>
                            <FormControl>
                                <ImageUpload
                                    value={field.value.map((image) => image.url)}
                                    disabled={loading} onChange={(url) => field.onChange([...field.value, { url }])}
                                    onRemove={(url) => field.onChange([...field.value.filter((current) => current.url !== url)])} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />
                    <div className='grid grid-cols-3 gap-8'>
                        <FormField control={form.control} name='name' render={({ field }) => (
                            <FormItem>
                                <FormLabel>Nombre</FormLabel>
                                <FormControl>
                                    <Input disabled={loading} placeholder='Nombre del producto' {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <FormField control={form.control} name='price' render={({ field }) => (
                            <FormItem>
                                <FormLabel>Precio</FormLabel>
                                <FormControl>
                                    <Input type='number' disabled={loading} placeholder='9.99' {...field} />
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
                        <FormField control={form.control} name="sizes" render={() => (
                            <FormItem>
                                <div className="mb-4">
                                    <FormLabel className="text-base">Talla</FormLabel>
                                </div>
                                {sizes.map((size) => (
                                    <FormField key={size.id} control={form.control} name="sizes" render={({ field }) => {
                                        return (
                                            <FormItem key={size.id} className="flex flex-row items-start space-x-2 space-y-0">
                                                <FormControl>
                                                    <Checkbox
                                                        checked={field.value?.includes(size.id)}
                                                        onCheckedChange={(checked) => {
                                                            return checked
                                                                ? field.onChange([...field.value, size.id])
                                                                : field.onChange(
                                                                    field.value?.filter(
                                                                        (value) => value !== size.id
                                                                    )
                                                                )
                                                        }}
                                                    />
                                                </FormControl>
                                                <FormLabel className="font-normal capitalize">
                                                    {size.value}
                                                </FormLabel>
                                            </FormItem>
                                        )
                                    }}
                                    />
                                ))}
                                <FormMessage />
                            </FormItem>
                        )}/>
                        <FormField control={form.control} name='colorId' render={({ field }) => (
                            <FormItem>
                                <FormLabel>Color</FormLabel>
                                    <Select disabled={loading} onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue defaultValue={field.value} placeholder="Selecciona un color" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {colors.map((color) => (
                                                <SelectItem key={color.id} value={color.id}>
                                                    {color.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <FormField control={form.control} name='categoryId' render={({ field }) => (
                            <FormItem>
                                <FormLabel>Categoría</FormLabel>
                                    <Select disabled={loading} onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue defaultValue={field.value} placeholder="Selecciona una categoría" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {categories.map((category) => (
                                                <SelectItem key={category.id} value={category.id}>
                                                    {category.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <FormField control={form.control} name='descriptionSmall' render={({ field }) => (
                            <FormItem>
                                <FormLabel>Descripción Corta</FormLabel>
                                <FormControl>
                                    <Textarea disabled={loading} placeholder='Máximo 50 Carácteres' {...field} className='resize-none' />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <FormField control={form.control} name='descriptionLong' render={({ field }) => (
                            <FormItem className='col-span-2'>
                                <FormLabel>Descripción larga</FormLabel>
                                <FormControl>
                                    <Textarea disabled={loading} placeholder='Máximo 500 Carácteres' {...field} className='h-44' />
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