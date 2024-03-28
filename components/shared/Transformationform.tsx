"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useEffect, useState, useTransition } from "react"
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
import { aspectRatioOptions, defaultValues, transformationTypes } from "@/constants"
import { CustomField } from "./Customfield"
import { AspectRatioKey, debounce, deepMergeObjects } from "@/lib/utils"
import Mediaupload from "./Mediaupload"
import Transformimage from "./Transformimage"
import { getCldImageUrl } from "next-cloudinary"
import { addImage, updateImage } from "@/lib/actions/image.actions"
import { useRouter } from "next/navigation"
export const formSchema = z.object({
  title: z.string(),
  aspectRatio: z.string().optional(),
  color: z.string().optional(),
  prompt: z.string().optional(),
  publicId: z.string(),

})


const Transformationform = ({ action, data = null, userId, type, config = null }: TransformationFormProps) => {
  const transformationType = transformationTypes[type]
  const [image, setimage] = useState(data)
  const [newTransformation, setnewTransformation] = useState<Transformations | null>(null)// for new transformation
  const [isSubmitting, setissubmitting] = useState(false)
  const [isTransforming, setistransforming] = useState(false)
  const [transformationconfig, settransformingconfig] = useState(config)
  const [isPendding, starttransition] = useTransition() //update state without blocking UI
  const router = useRouter()
  const initialvalue = data && action === 'Update' ? {
    //this will be only called when form has existing values
    title: data?.title,
    aspectRatio: data?.aspectRatio,
    color: data?.color,
    prompt: data?.prompt,
    publicId: data?.publicId,

  } : defaultValues
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialvalue
  })


  async function onSubmit(values: z.infer<typeof formSchema>) {

    setissubmitting(true)
    if (data || image) {
      const transformationurl = getCldImageUrl({
        width: image?.width,
        height: image?.height,
        src: image?.publicId,
        ...transformationconfig
      })
      const imageData = {
        title: values.title,
        publicId: image?.publicId,
        transformationType: type,
        width: image?.width,
        height: image?.height,
        config: transformationconfig,
        secureURL: image?.secureURL,
        transformationURL: transformationurl,
        aspectRatio: values.aspectRatio,
        prompt: values.prompt,
        color: values.color,

      }
      if (action === 'Add') {
        try {
          const newImage = await addImage({
            image: imageData,
            userId,
            path: '/'
          })

          if (newImage) {
            form.reset()
            setimage(data)
            router.push(`/transformation/${newImage._id}`)
          }

        } catch (error) {
          console.log(error)
        }
      }
      if (action === 'Update') {
        try {
          const updatedImage = await updateImage({
            image: {
              ...imageData,
              _id: data._id
            },
            userId,
            path: `/transformation/${data._id}`
          })

          if (updatedImage) {
            router.push(`/transformation/${updatedImage._id}`)
          }

        } catch (error) {
          console.log(error)
        }
      }
    }
    setissubmitting(false) // hopefully successfully submitted the form 
  }

  const onselectfieldhandler = (value: string, onChangeField: (value: string) => void) => {
    const imagesize = aspectRatioOptions[value as AspectRatioKey]
    setimage((prevstate: any) => ({
      ...prevstate,
      aspectRatio: imagesize.aspectRatio,
      width: imagesize.width,
      height: imagesize.height
    }))
    setnewTransformation(transformationType.config)
    return onChangeField(value)
  }
  const onInputChangeHandler = (fieldname: string, value: string, type: string, onChangeField: (value: string) => void) => {
    debounce(() => {
      setnewTransformation((prevstate: any) => ({
        ...prevstate,
        [type]: {
          ...prevstate?.[type],
          [fieldname === 'prompt' ? 'prompt' : 'to']: value
        }
      }))
    }, 1000)()
    return onChangeField(value)
  }
  const onTransformHandler = async () => {
    setistransforming(true)
    settransformingconfig(deepMergeObjects(newTransformation, transformationconfig))
    setnewTransformation(null)
    starttransition(async () => {
      // await updatecredits()
    })
  }

  useEffect(()=>{
    if(image && type==="restore" || type==="removeBackground"){
      setnewTransformation(transformationType.config)
    }

  }, [image, transformationType.config, type])

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <CustomField
          control={form.control}
          name="title"
          formLabel="Image title"
          render={({ field }) => <Input {...field} className="input-field" />}
        />
        {type === 'fill' && (
          <CustomField
            control={form.control}
            name='aspectRatio'
            formLabel="Aspect Ratio"
            render={({ field }) => (
              <Select onValueChange={(value) => onselectfieldhandler(value, field.onChange)}
              value={field.value}>
                <SelectTrigger className="select-field">
                  <SelectValue placeholder="Select size" />
                </SelectTrigger>
                <SelectContent>
                  {Object.keys(aspectRatioOptions).map(
                    (key) => (
                      <SelectItem key={key} value={key} className="select-item">
                        {aspectRatioOptions[key as AspectRatioKey].label}
                      </SelectItem>
                    )
                  )}
                </SelectContent>
              </Select>

            )} />
        )}
        {(type === 'remove' || type === 'recolor') && (
          <div className="prompt-field">
            <CustomField
              control={form.control}
              name="prompt"
              formLabel={
                type === 'remove' ? 'Object to remove' : 'Object to recolor'
              }
              className="w-full"
              render={({ field }) => (<Input
                value={field.value}
                className="input-field"
                onChange={(e) => onInputChangeHandler(
                  'prompt', e.target.value, type, field.onChange
                )}
              />
              )}
            />
            {type === 'recolor' && (
              <CustomField
                control={form.control}
                name='color'
                formLabel=" replacement color"
                className="w-full"
                render={({ field }) => (<Input
                  value={field.value}
                  className="input-field"
                  onChange={(e) => onInputChangeHandler(
                    'color', e.target.value, 'recolor', field.onChange
                  )}
                />
                )}
              />
            )}
          </div>
        )}

        <div className="media-uploader-field">
          <CustomField
            control={form.control}
            name="publicId"
            render={({ field }) => (
              <Mediaupload
                onValueChange={field.onChange}
                setimage={setimage}
                publicId={field.value}
                image={image}
                type={type}


              />
            )}
          />
          <Transformimage
            image={image}
            type={type}
            title={form.getValues().title}
            isTransforming={isTransforming}
            setIsTransforming={setistransforming}
            transformationConfig={transformationconfig}

          />
        </div>

        <div className="flex flex-col gap-4">
          <Button className="submit-button capitalize" type="button"
            disabled={isTransforming || newTransformation === null}
            onClick={onTransformHandler}
          >
            {isTransforming ? 'Transformaing...' : 'Apply transformation'}
          </Button>

          <Button className="submit-button capitalize" type="submit"
            disabled={isSubmitting}
          >{isSubmitting ? 'Submitting' : 'save image'}</Button>
        </div>
      </form>
    </Form>
  )
}

export default Transformationform