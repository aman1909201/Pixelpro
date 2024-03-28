"use client";
import { useToast } from "@/components/ui/use-toast"
import { dataUrl, getImageSize } from "@/lib/utils";
import { CldImage, CldUploadWidget } from 'next-cloudinary';
import { PlaceholderValue } from "next/dist/shared/lib/get-img-props";
import Image from "next/image";
import { FaPlus } from "react-icons/fa";
type MediaUploaderProps = {
    onValueChange: (value: string) => void;
    setimage: React.Dispatch<any>
    publicId: string
    image: any
    type: string

}
const Mediaupload = ({
    onValueChange, setimage, image, publicId, type
}: MediaUploaderProps) => {
    const { toast } = useToast()
    const onUploadsuccesshandler = (result: any) => {
        setimage((prevState: any) => ({
            ...prevState,
            publicId: result?.info?.public_id,
            width: result?.info?.width,
            height: result?.info?.height,
            secureURL: result?.info?.secure_url
        }))
        onValueChange(result?.info?.public_id)
        toast({
            title: "Image uploaded successfully",
            description: "enjoy with your image",
            duration: 6000,
            className: 'success-toast'
        })
    }
    const onUploaderrorhandler = () => {
        toast({
            title: "somthing is error while uploading",
            description: "please try again",
            duration: 6000,
            className: 'error-toast'
        })
    }
    return (
        <CldUploadWidget
            uploadPreset="PixelPro"
            options={{
                multiple: false,
                resourceType: "image"
            }}
            onSuccess={onUploadsuccesshandler}
            onError={onUploaderrorhandler}
        >
            {({ open }) => (
                <div className="flex flex-col gap-4">
                    <h3 className="h3-bold text-dark-400">Original</h3>

                    {publicId ? (
                        <>
                            <div className="cursor-pointer overflow-hidden rounded-[10px]">
                                <CldImage
                                    width={getImageSize(type, image, "width")}
                                    height={getImageSize(type, image, "height")}
                                    src={publicId}
                                    alt="image"
                                    placeholder={dataUrl as PlaceholderValue}
                                    className="media-uploader_ctaImage"
                                />
                            </div>
                        </>
                    ) : (
                        <div className="media-uploader_cta" >
                            <div className="media-uploader_cta-image" onClick={() => open()}>
                            <FaPlus size={20} />
                            </div>
                            <p> click here for upload</p>
                        </div>
                    )}
                </div>
            )}
        </CldUploadWidget>
    )
}

export default Mediaupload