"use client"
import { dataUrl, debounce, download, getImageSize } from '@/lib/utils'
import { CldImage, getCldImageUrl } from 'next-cloudinary'
import { PlaceholderValue } from 'next/dist/shared/lib/get-img-props'
import Image from 'next/image'
import React from 'react'
import { IoMdCloudDownload } from "react-icons/io";
import {Spinner} from "@nextui-org/react";

const Transformimage = ({ image, type, title, isTransforming, setIsTransforming, transformationConfig, hasDownload = false }: TransformedImageProps) => {
    const downloadhandler = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault()

        download(getCldImageUrl({
            width: image?.width,
            height: image?.height,
            src: image?.publicId,
         ...transformationConfig
        }),title)

    }
    return (
        <div className='flex flex-col gap-4'>
            <div className='flex-between'>
                <h2 className='h3-bold text-dark-400'>
                    Transform
                </h2>
                {hasDownload && (
                    <button className='download-btn' onClick={downloadhandler}>
                       <IoMdCloudDownload size={24} />
                    </button>
                )}
            </div>
            {image?.publicId && transformationConfig ? (
                <div>
                    <CldImage
                        width={getImageSize(type, image, "width")}
                        height={getImageSize(type, image, "height")}
                        src={image?.publicId}
                        alt={image.title}
                        sizes={"(max-width: 750)"}
                        placeholder={dataUrl as PlaceholderValue}
                        className="transformed-image"
                        onLoad={() => {
                            setIsTransforming && setIsTransforming(false)
                        }}
                        onError={() => {
                            debounce(() => {
                                setIsTransforming && setIsTransforming(false)
                            }, 4000)()
                        }}
                        {...transformationConfig}
                    />
                    {isTransforming && (
                        <div className='transforming-loader'>
                           <Image
                           src="/svgimages/spinner.svg"
                           width={50}
                           height={50}
                           alt='spinner' 
                           />
                        </div>
                    )}
                </div>
            ) : (
                <div className='transformed-placeholder'>
                    Transformed image
                </div>
            )}
        </div>
    )
}

export default Transformimage