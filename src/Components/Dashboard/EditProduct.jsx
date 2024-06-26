import React, { useState, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import { confirmAlert } from "react-confirm-alert"
import * as yup from "yup"
import { yupResolver } from "@hookform/resolvers/yup"
import { useForm } from "react-hook-form"
import { Box, Button, TextField, Typography, InputLabel, MenuItem, FormControl, Select, CircularProgress  } from "@mui/material"
import PhotoCamera from "@mui/icons-material/PhotoCamera"
import {
    // setUpdateSelectedProductToFirestore,
    setUploadProductImageToStorage,
    setProductTabImageToStorage,
} from "../../Utils/firebase"
import productSlice from "../../Redux/Product/ProductSlice"

const {
    getProductsData,
    setUpdateSelectedProductToFirestore,
} = productSlice.actions

const EditProduct = () => {
    const [productTitle, setProductTitle] = useState("")
    const [editProductInfo, setEditProductInfo] = useState({})
    const [imageUpload, setImageUpload] = useState({
        imageFile: {},
        imageUrl: "",
        fileLength: 0,
    })
    const [uploadTabImageList, setUploadTabImageList] = useState([])
    const productsData = useSelector(state => state.products.productsData)
    const productLoading = useSelector(state => state.products.productLoading)
    const {
        title,
        productId,
        originalPrice,
        discountPrice,
        desc,
        deliveryDesc,
        tabDesc,
        stock,
        quantity,
        mainImg,
        tabsImagesData,
    } = editProductInfo
    const { imageUrl, imageFile, fileLength } = imageUpload
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(getProductsData())
    }, [])

    useEffect(() => {}, [uploadTabImageList, imageUpload, editProductInfo])

    const formValidate = yup.object().shape({
        imageUpload: yup.mixed().test(
            "repeat productName",
            "${value} 此商品名稱已存在",
            function(files) {
                // 如果没有 `mainImg` 或者 `files` 为空数组，验证通过
                if (mainImg === undefined || (mainImg && (!files || files.length === 0))) {
                    return true;
                }

                // 获取文件名或从 mainImg 解码出的文件名
                const fileName = files && files.length > 0 ? files[0].name.split(".")[0] : decodeURIComponent(mainImg);

                // 检查文件名是否包含 productTitle
                const isDuplicate = fileName.includes(productTitle);

                if (!isDuplicate) {
                    return this.createError({
                        message: `${fileName} 與 ${productTitle} 商品名稱不相符`,
                    });
                }
                return true;
            }
        ),
    })

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(formValidate),
    })

    const handleChange = event => {
        setProductTitle(event.target.value)
        const selectedImageIndex = productsData.findIndex(item => item.title === event.target.value)
        setEditProductInfo(productsData[selectedImageIndex])
        setImageUpload({
            imageFile: {},
            imageUrl: productsData[selectedImageIndex].mainImg,
            fileLength: 0
        })
    }

    const handleChangeMainImage = event => {
        const file = event.target.files[0]
        if(file) {
            setImageUpload(prevState => ({
                ...prevState,
                imageFile: file,
                imageUrl: URL.createObjectURL(file),
                fileLength: event.target.files.length
            }))
        }
    }

    const handleTabImageUpload = e => {
        const files = Array.from(e.target.files)
        let tempData = []
        if (files.length === 1) {
            setUploadTabImageList([
                {
                    productName: productTitle,
                    name: files[0].name,
                    file: files[0],
                    url: URL.createObjectURL(files[0]),
                },
            ])
        } else {
            files.forEach(file => {
                let fileObj = {
                    productName: productTitle,
                    name: file.name,
                    file: file,
                    url: URL.createObjectURL(file),
                }
                tempData.push(fileObj)
                setUploadTabImageList(tempData)
            })
        }
    }

    const handleEditChange = (e, inputId) => {
        switch (inputId) {
            case "productName":
                setEditProductInfo({
                    ...editProductInfo,
                    productName: e.target.value,
                    title: e.target.value,
                })
                break
            case "productId":
                setEditProductInfo({
                    ...editProductInfo,
                    productId: parseInt(e.target.value),
                })
                break
            case "originalPrice":
                setEditProductInfo({
                    ...editProductInfo,
                    originalPrice: parseInt(e.target.value),
                })
                break
            case "discountPrice":
                setEditProductInfo({
                    ...editProductInfo,
                    discountPrice: parseInt(e.target.value),
                })
                break
            case "desc":
                setEditProductInfo({
                    ...editProductInfo,
                    desc: e.target.value,
                })
                break
            case "tabDesc":
                setEditProductInfo({
                    ...editProductInfo,
                    tabDesc: e.target.value,
                })
                break
            case "deliveryDesc":
                setEditProductInfo({
                    ...editProductInfo,
                    deliveryDesc: e.target.value,
                })
                break
            case "stock":
                setEditProductInfo({
                    ...editProductInfo,
                    stock: parseInt(e.target.value),
                })
                break
            default:
                break
        }
    }


    const handleEditClick = () => {
        confirmAlert({
            title: `編輯商品`,
            message: `確定要編輯${editProductInfo.title}?`,
            buttons: [
                {
                    label: "是",
                    onClick: () => {
                        setUploadProductImageToStorage(imageFile, productTitle, fileLength)
                        setProductTabImageToStorage(uploadTabImageList)
                        dispatch(setUpdateSelectedProductToFirestore({
                            ...editProductInfo,
                            mainImg: imageUrl
                        }))
                    },

                },
                {
                    label: "否",
                },
            ],
        })
    }

    return (
        <Box
            sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
                gap: "15px",
                minHeight: {
                    xs: "calc( 95vh - 68.5px - 128px - 108px )",
                    md: "calc( 95vh - 68.5px - 128px - 108px )",
                    lg: "calc( 95vh - 68.5px - 128px - 108px )",
                },
            }}>
                {
                    productLoading
                        ? <CircularProgress />
                        : (
                            <>
                                <Typography
                                    align="center"
                                    sx={{
                                        fontWeight: "bold",
                                        color: "red",
                                        fontSize: {
                                            xs: "20px",
                                            md: "25px",
                                            lg: "35px",
                                        },
                                    }}>
                                    編輯商品前請先重整頁面讀取資料!
                                    <br />
                                    如更換商品圖，請先將檔名設定為商品名稱!
                                </Typography>
                                <FormControl sx={{ m: 1, minWidth: 160 }}>
                                    <InputLabel id="remove-product">選擇編輯的商品</InputLabel>
                                    <Select
                                        labelId="remove-product"
                                        id="demo-simple-select-autowidth"
                                        value={productTitle}
                                        onChange={handleChange}
                                        autoWidth
                                        label="選擇編輯的商品">
                                        {productsData.map(product => {
                                            return (
                                                <MenuItem key={product.title} value={product.title}>
                                                    {product.title}
                                                </MenuItem>
                                            )
                                        })}
                                    </Select>
                                </FormControl>
                                <Box
                                    component="form"
                                    sx={{
                                        "& .MuiTextField-root": {
                                            mt: 3,
                                            width: { xs: "38ch", lg: "50ch" },
                                        },
                                        display: "inline-flex",
                                        flexWrap: "wrap",
                                        justifyContent: "center",
                                        gap: "10px",
                                    }}
                                    noValidate
                                    autoComplete="off">
                                    <TextField
                                        id="productName"
                                        label="商品名稱 (productName)"
                                        type="text"
                                        value={title}
                                        onChange={e => {
                                            handleEditChange(e, "productName")
                                        }}
                                        InputLabelProps={{ shrink: true }}
                                    />
                                    <TextField
                                        sx={{
                                            display: "none",
                                        }}
                                        id="productId"
                                        label="商品編號 (id)"
                                        type="hidden"
                                        value={productId}
                                        onChange={e => {
                                            handleEditChange(e, "productId")
                                        }}
                                        InputLabelProps={{ shrink: true }}
                                    />
                                    <TextField
                                        id="originalPrice"
                                        label="原始價格 (originalPrice)"
                                        type="number"
                                        value={originalPrice}
                                        onChange={e => {
                                            handleEditChange(e, "originalPrice")
                                        }}
                                        InputLabelProps={{ shrink: true }}
                                    />
                                    <TextField
                                        id="discountPrice"
                                        label="折扣價格 (discountPrice)"
                                        type="number"
                                        value={discountPrice}
                                        onChange={e => {
                                            handleEditChange(e, "discountPrice")
                                        }}
                                        InputLabelProps={{ shrink: true }}
                                    />
                                    <TextField
                                        id="stock"
                                        label="商品庫存 (stock)"
                                        type="number"
                                        value={stock}
                                        onChange={e => {
                                            handleEditChange(e, "stock")
                                        }}
                                        InputLabelProps={{ shrink: true }}
                                    />

                                    <TextField
                                        sx={{
                                            display: "none",
                                        }}
                                        id="read-only-quantity"
                                        label="商品目前數量(quantity)"
                                        type="hidden"
                                        defaultValue={quantity}
                                        InputProps={{
                                            readOnly: true,
                                        }}
                                    />
                                    <TextField
                                        sx={{
                                            display: "none",
                                        }}
                                        id="read-only-title"
                                        label="商品名稱 (title)"
                                        type="hidden"
                                        value={title}
                                        InputProps={{
                                            readOnly: true,
                                        }}
                                    />
                                    <TextField
                                        multiline
                                        id="desc"
                                        label="商品描述 (desc)"
                                        type="text"
                                        value={desc}
                                        onChange={e => {
                                            handleEditChange(e, "desc")
                                        }}
                                        InputLabelProps={{ shrink: true }}
                                    />
                                    <TextField
                                        multiline
                                        id="deliveryDesc"
                                        label="送貨及付款方式 (deliveryDesc)"
                                        type="text"
                                        value={deliveryDesc}
                                        onChange={e => {
                                            handleEditChange(e, "deliveryDesc")
                                        }}
                                        InputLabelProps={{ shrink: true }}
                                    />
                                    <TextField
                                        multiline
                                        id="tabDesc"
                                        label="商品 Tab 描述 (tabDesc)"
                                        type="text"
                                        value={tabDesc}
                                        onChange={e => {
                                            handleEditChange(e, "tabDesc")
                                        }}
                                        InputLabelProps={{ shrink: true }}
                                    />
                                    <TextField
                                        component="label"
                                        htmlFor="imageUpload"
                                        label={
                                            <Box
                                                sx={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                }}>
                                                上傳商品圖片
                                                <PhotoCamera />
                                            </Box>
                                        }
                                        inputProps={{
                                            id: "imageUpload",
                                            type: "file",
                                            defaultValue: "",
                                            style: {
                                                visibility: "hidden",
                                                zIndex: 999,
                                            },
                                            onChange: e => {
                                                handleChangeMainImage(e)
                                            },
                                        }}
                                        InputProps={{
                                            startAdornment: (
                                                <Box
                                                    component="img"
                                                    src={imageUrl !== '' ? imageUrl : "https://fakeimg.pl/250x200/?text=預覽圖&font=noto"}
                                                    sx={{
                                                        objectFit: "contain",
                                                        width: "250px",
                                                        height: "200px",
                                                    }}
                                                />
                                            ),
                                            endAdornment: (
                                                <Box
                                                    sx={{
                                                        display: "flex",
                                                        alignItems: "center",
                                                        cursor: "pointer",
                                                        position: "absolute",
                                                        bottom: "5%",
                                                    }}>
                                                    <Typography>更新商品圖片</Typography>
                                                    <PhotoCamera />
                                                </Box>
                                            ),
                                        }}
                                        sx={{
                                            ".MuiOutlinedInput-root": {
                                                paddingTop: "1rem",
                                                flexDirection: "column",
                                                cursor: "pointer",
                                            },
                                        }}
                                        error={!!errors?.imageUpload}
                                        helperText={errors?.imageUpload ? `${errors.imageUpload.message}` : null}
                                        {...register("imageUpload", {
                                        })}
                                    />
                                    {/* <TextField
                                        component="label"
                                        htmlFor="tabImageUpload"
                                        label={
                                            <Box
                                                sx={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                }}>
                                                上傳商品描述圖片
                                                <PhotoCamera />
                                            </Box>
                                        }
                                        inputProps={{
                                            multiple: true,
                                            id: "tabImageUpload",
                                            type: "file",
                                            style: {
                                                visibility: "hidden",
                                                zIndex: 999,
                                            },
                                        }}
                                        InputProps={{
                                            // 不上傳 tabsImagesData === [] 就要秀預覽，如果有資料就要秀原本的圖，然後onChange要秀新的圖
                                            startAdornment:
                                                tabsImagesData === undefined || tabsImagesData.length === 0 ? (
                                                    <Box
                                                        component="img"
                                                        src={"https://fakeimg.pl/250x200/?text=預覽圖&font=noto"}
                                                        sx={{
                                                            objectFit: "contain",
                                                            width: "250px",
                                                            height: "200px",
                                                        }}
                                                    />
                                                ) : uploadTabImageList.length === 0 && tabsImagesData?.length > 0 ? (
                                                    tabsImagesData?.map((tabImage, index) => {
                                                        console.log("預覽2")
                                                        return (
                                                            <Box
                                                                key={index}
                                                                component="img"
                                                                src={tabImage}
                                                                sx={{
                                                                    objectFit: "contain",
                                                                    width: "250px",
                                                                    height: "200px",
                                                                }}
                                                            />
                                                        )
                                                    })
                                                ) : (
                                                    uploadTabImageList?.map((uploadTabImage, index) => {
                                                        console.log("預覽3")
                                                        return (
                                                            <Box
                                                                key={index}
                                                                component="img"
                                                                src={uploadTabImage.url}
                                                                sx={{
                                                                    objectFit: "contain",
                                                                    width: "250px",
                                                                    height: "200px",
                                                                }}
                                                            />
                                                        )
                                                    })
                                                ),
                                            endAdornment: (
                                                <Box
                                                    sx={{
                                                        display: "flex",
                                                        alignItems: "center",
                                                        cursor: "pointer",
                                                        position: "absolute",
                                                        bottom: "5%",
                                                    }}>
                                                    <Typography>更新商品圖片</Typography>
                                                    <PhotoCamera />
                                                </Box>
                                            ),
                                        }}
                                        sx={{
                                            ".MuiOutlinedInput-root": {
                                                paddingTop: "1rem",
                                                flexDirection: "column",
                                                cursor: "pointer",
                                            },
                                        }}
                                        onChange={e => {
                                            handleTabImageUpload(e)
                                        }}
                                    /> */}
                                </Box>
                                <Button
                                    variant="contained"
                                    disabled={productTitle === ""}
                                    onClick={handleSubmit(handleEditClick)}
                                    sx={{
                                        height: "fit-content",
                                        width: {
                                            xs: "68%",
                                            md: "78%",
                                            lg: "78%"
                                        },
                                    }}
                                >
                                    編輯商品
                                </Button>
                            </>
                        )
                }
        </Box>
    )
}

export default EditProduct
