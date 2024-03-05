"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { defaultValues } from "@/constants"
const formSchema = z.object({
  title: z.string(),
  aspectRatio: z.string().optional(),
  color:  z.string().optional(),
  prompt: z.string().optional(),
 publicId: z.string()
})


const Transformationform = ({action, data=null}:TransformationFormProps) => {
  const initialvalue= data && action ==='Update' ?{ 
    //this will be only called when form has existing values
    title: data?.title,
    aspectRatio: data?.aspectRatio,
    color: data?.color,
    prompt: data?.prompt,
    publicId: data?.publicId,
  }: defaultValues
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialvalue
  })
  
  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values)
  }
  return (
    <Form {...form}>
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
     
      <Button type="submit">Submit</Button>
    </form>
  </Form>
  )
}

export default Transformationform