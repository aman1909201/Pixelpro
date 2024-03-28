export const navLinks = [
    {
      label: "Home",
      route: "/",
      icon: "/svgimages/home.svg",
    },
    {
      label: "Image Restore",
      route: "/transformation/add/restore",
      icon: "/svgimages/image.svg",
    },
    {
      label: "Generative Fill",
      route: "/transformation/add/fill",
      icon: "/svgimages/fill.svg",
    },
    {
      label: "Object Remove",
      route: "/transformation/add/remove",
      icon: "/svgimages/erase.svg",
    },
    {
      label: "Object Recolor",
      route: "/transformation/add/recolor",
      icon: "/svgimages/recolor.svg",
    },
    {
      label: "Background Remove",
      route: "/transformation/add/removeBackground",
      icon: "/svgimages/camera.svg",
    },
    {
      label: "Profile",
      route: "/profile",
      icon: "/svgimages/profile.svg",
    },
   
  ];
  
 
  
  export const transformationTypes = {
    restore: {
      type: "restore",
      title: "Restore Image",
      subTitle: "Refine images by removing noise and imperfections",
      config: { restore: true },
      icon: "image.svg",
    },
    removeBackground: {
      type: "removeBackground",
      title: "Background Remove",
      subTitle: "Removes the background of the image using AI",
      config: { removeBackground: true },
      icon: "camera.svg",
    },
    fill: {
      type: "fill",
      title: "Generative Fill",
      subTitle: "Enhance an image's dimensions using AI outpainting",
      config: { fillBackground: true },
      icon: "stars.svg",
    },
    remove: {
      type: "remove",
      title: "Object Remove",
      subTitle: "Identify and eliminate objects from images",
      config: {
        remove: { prompt: "", removeShadow: true, multiple: true },
      },
      icon: "scan.svg",
    },
    recolor: {
      type: "recolor",
      title: "Object Recolor",
      subTitle: "Identify and recolor objects from the image",
      config: {
        recolor: { prompt: "", to: "", multiple: true },
      },
      icon: "filter.svg",
    },
  };
  
  export const aspectRatioOptions = {
    "1:1": {
      aspectRatio: "1:1",
      label: "Square (1:1)",
      width: 1000,
      height: 1000,
    },
    "3:4": {
      aspectRatio: "3:4",
      label: "Standard Portrait (3:4)",
      width: 1000,
      height: 1334,
    },
    "9:16": {
      aspectRatio: "9:16",
      label: "Phone Portrait (9:16)",
      width: 1000,
      height: 1778,
    },
  };
  
  export const defaultValues = {
    title: "",
    aspectRatio: "",
    color: "",
    prompt: "",
    publicId: "",
  };
  
