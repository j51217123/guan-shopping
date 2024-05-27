import React, { useState, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import * as yup from "yup"
import { yupResolver } from "@hookform/resolvers/yup"
import { Controller, useForm } from "react-hook-form"
import { confirmAlert } from "react-confirm-alert"
import { v4 as uuid } from "uuid"
import { Box, Button, Container, Typography, TextField, CircularProgress } from "@mui/material"
import { PhotoCamera, Delete as DeleteIcon } from "@mui/icons-material"
import productSlice from "../../Redux/Product/ProductSlice"

const { setProductDataToFirestore } = productSlice.actions

const initUploadProduct = {
    productName: "",
    title: "",
    productId: 0,
    originalPrice: 0,
    discountPrice: 0,
    desc: "",
    tabDesc: "",
    deliveryDesc: "",
    stock: 0,
    quantity: 1,
    mainImg: "",
}

const AddProduct = () => {
    const productsData = useSelector(state => state.products.productsData)
    const productLoading = useSelector(state => state.products.productLoading)

    const [uploadProductInfo, setUploadProductInfo] = useState(initUploadProduct)
    const [imageUpload, setImageUpload] = useState({
        imageFile: {},
        imageUrl: "",
    })
    const [tabImageList, setTabImageList] = useState([])
    const dispatch = useDispatch()
    useEffect(() => {
        setUploadProductInfo({
            ...uploadProductInfo,
            productId: uuid(),
        })
    }, [productsData.length])

    useEffect(() => {
        setUploadProductInfo({
            ...uploadProductInfo,
            tabImageList,
        })
    }, [tabImageList])

    const formValidate = yup.object().shape({
        productName: yup
            .string()
            .required("欄位不得為空")
            .test("repeat productName", "${value} 此商品名稱已存在", (value, testContext) => {
                const selectedData = productsData.find(item => item.title === value)
                if (selectedData !== undefined && value === selectedData.title) {
                    return testContext.createError({
                        message: "${originalValue} 此商品名稱已存在",
                    })
                } else {
                    return true
                }
            }),
        originalPrice: yup.number().typeError("請輸入數字").required("欄位不得為空"),
        discountPrice: yup.number().typeError("請輸入數字").required("欄位不得為空"),
        stock: yup.number().typeError("請輸入數字").required("欄位不得為空"),
        desc: yup.string().required("欄位不得為空"),
        tabDesc: yup.string().required("欄位不得為空"),
        deliveryDesc: yup.string().required("欄位不得為空"),
        imageUpload: yup.mixed().test("required", "請上傳商品圖片", (files, testContext) => {
            if (files.length > 0) {
                const selectedData = productsData.find(item => item.imageFileName === files[0].name)
                if (files.length > 0 && selectedData !== undefined && files[0].name === selectedData.imageFileName) {
                    return testContext.createError({
                        message: `${files[0].name} 此圖片已存在`,
                    })
                } else if (!uploadProductInfo.productName.includes(files[0].name.split(".")[0])) {
                    return testContext.createError({
                        message: `${files[0].name} 與 ${uploadProductInfo.productName} 名稱不相符`,
                    })
                } else {
                    return true
                }
            }
        }),
    })

    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(formValidate),
    })

    const handleChange = (e, inputId) => {
        switch (inputId) {
            case "productName":
                setUploadProductInfo({
                    ...uploadProductInfo,
                    productName: e.target.value,
                    title: e.target.value,
                })
                break
            case "originalPrice":
                setUploadProductInfo({
                    ...uploadProductInfo,
                    originalPrice: parseInt(e.target.value),
                })
                break
            case "discountPrice":
                setUploadProductInfo({
                    ...uploadProductInfo,
                    discountPrice: parseInt(e.target.value),
                })
                break
            case "desc":
                setUploadProductInfo({
                    ...uploadProductInfo,
                    desc: e.target.value,
                })
                break
            case "tabDesc":
                setUploadProductInfo({
                    ...uploadProductInfo,
                    tabDesc: e.target.value,
                })
                break
            case "deliveryDesc":
                setUploadProductInfo({
                    ...uploadProductInfo,
                    deliveryDesc: e.target.value,
                })
                break
            case "stock":
                setUploadProductInfo({
                    ...uploadProductInfo,
                    stock: parseInt(e.target.value),
                })
                break
            default:
                break
        }
    }

    const handleImageUpload = e => {
        const file = e.target.files[0]
        console.log("🚀 - file:", file)
        setImageUpload({
            imageFile: file,
            imageUrl: URL.createObjectURL(file),
        })
        setUploadProductInfo({
            ...uploadProductInfo,
            imageFileName: file.name,
        })
    }

    const handleTabImageUpload = e => {
        const files = Array.from(e.target.files)
        let tempData = []
        if (files.length === 1) {
            setTabImageList([
                {
                    productName,
                    name: files[0].name,
                    file: files[0],
                    url: URL.createObjectURL(files[0]),
                },
            ])
        } else {
            files.forEach(file => {
                let fileObj = {
                    productName,
                    name: file.name,
                    file: file,
                    url: URL.createObjectURL(file),
                }
                tempData.push(fileObj)
                setTabImageList(tempData)
            })
        }
    }

    const handleFormSubmit = () => {
        confirmAlert({
            title: `上傳商品`,
            message: `確定要上傳${uploadProductInfo.title}?`,
            buttons: [
                {
                    label: "是",
                    onClick: () => {
                        dispatch(
                            setProductDataToFirestore({
                                uploadProductInfo: {
                                    ...uploadProductInfo,
                                    mainImg: imageUrl,
                                },
                                imageFile,
                            })
                        )
                    },
                },
                {
                    label: "否",
                },
            ],
        })
    }

    const handleRemoveImageFile = (e, type) => {
        if (type === "imageUpload") {
            e.target.parentNode.parentNode.previousSibling.value = ""
            setImageUpload({
                imageFile: {},
                imageUrl: "",
            })
        }
    }
    const { productId, productName, originalPrice, discountPrice, desc, tabDesc, deliveryDesc, stock, quantity } =
        uploadProductInfo
    const { imageFile, imageUrl } = imageUpload
    return (
        <Box>
            {productLoading ? (
                <CircularProgress
                    sx={{
                        position: "absolute",
                        top: "35%",
                        left: "50%",
                        transform: "translate(-35%, -50%)",
                    }}
                />
            ) : (
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
                        新增商品前請先重整頁面讀取資料!
                        <br />
                        如更換商品圖，請先將檔名設定為商品名稱!
                    </Typography>
                    <Box
                        component="form"
                        sx={{
                            "& .MuiTextField-root": {
                                mt: 5,
                                width: { xs: "38ch", lg: "50ch" },
                            },
                            display: "inline-flex",
                            flexWrap: "wrap",
                            justifyContent: "center",
                            gap: "10px",
                        }}
                        noValidate
                        autoComplete="off">
                        <Controller
                            name={`productName`}
                            control={control}
                            render={() => (
                                <TextField
                                    id="productName"
                                    label="商品名稱 (productName)"
                                    type="text"
                                    value={productName}
                                    InputLabelProps={{ shrink: true }}
                                    error={!!errors?.productName}
                                    helperText={errors?.productName ? `${errors.productName.message}` : null}
                                    {...register("productName", {
                                        onChange: e => {
                                            handleChange(e, "productName")
                                        },
                                    })}
                                />
                            )}
                        />
                        <TextField
                            sx={{
                                display: "none",
                            }}
                            id="read-only-productId"
                            label="商品編號 (id)"
                            type="hidden"
                            value={productId}
                            InputProps={{
                                readOnly: true,
                            }}
                        />
                        <Controller
                            name={`originalPrice`}
                            control={control}
                            render={() => (
                                <TextField
                                    id="originalPrice"
                                    label="原始價格 (originalPrice)"
                                    type="number"
                                    value={originalPrice}
                                    InputLabelProps={{ shrink: true }}
                                    error={!!errors?.originalPrice}
                                    helperText={errors?.originalPrice ? `${errors.originalPrice.message}` : null}
                                    {...register("originalPrice", {
                                        onChange: e => {
                                            handleChange(e, "originalPrice")
                                        },
                                    })}
                                />
                            )}
                        />
                        <Controller
                            name={`discountPrice`}
                            control={control}
                            render={() => (
                                <TextField
                                    id="discountPrice"
                                    label="折扣價格 (discountPrice)"
                                    type="number"
                                    value={discountPrice}
                                    InputLabelProps={{ shrink: true }}
                                    error={!!errors?.discountPrice}
                                    helperText={errors?.discountPrice ? `${errors.discountPrice.message}` : null}
                                    {...register("discountPrice", {
                                        onChange: e => {
                                            handleChange(e, "discountPrice")
                                        },
                                    })}
                                />
                            )}
                        />
                        <Controller
                            name={`stock`}
                            control={control}
                            render={() => (
                                <TextField
                                    id="stock"
                                    label="商品庫存 (stock)"
                                    type="number"
                                    value={stock}
                                    InputLabelProps={{ shrink: true }}
                                    error={!!errors?.stock}
                                    helperText={errors?.stock ? `${errors.stock.message}` : null}
                                    {...register("stock", {
                                        onChange: e => {
                                            handleChange(e, "stock")
                                        },
                                    })}
                                />
                            )}
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
                            value={productName}
                            InputProps={{
                                readOnly: true,
                            }}
                        />
                        <Controller
                            name={`desc`}
                            control={control}
                            render={() => (
                                <TextField
                                    multiline
                                    id="desc"
                                    label="商品標題描述 (desc)"
                                    type="text"
                                    value={desc}
                                    InputLabelProps={{ shrink: true }}
                                    error={!!errors?.desc}
                                    helperText={errors?.desc ? `${errors.desc.message}` : null}
                                    {...register("desc", {
                                        onChange: e => {
                                            handleChange(e, "desc")
                                        },
                                    })}
                                />
                            )}
                        />
                        <Controller
                            name={`deliveryDesc`}
                            control={control}
                            render={() => (
                                <TextField
                                    multiline
                                    id="deliveryDesc"
                                    label="送貨及付款方式 (deliveryDesc)"
                                    type="text"
                                    value={deliveryDesc}
                                    InputLabelProps={{ shrink: true }}
                                    error={!!errors?.deliveryDesc}
                                    helperText={errors?.deliveryDesc ? `${errors.deliveryDesc.message}` : null}
                                    {...register("deliveryDesc", {
                                        onChange: e => {
                                            handleChange(e, "deliveryDesc")
                                        },
                                    })}
                                />
                            )}
                        />
                        <Controller
                            name={`tabDesc`}
                            control={control}
                            render={() => (
                                <TextField
                                    multiline
                                    id="tabDesc"
                                    label="商品 Tab 描述 (tabDesc)"
                                    type="text"
                                    value={tabDesc}
                                    InputLabelProps={{ shrink: true }}
                                    error={!!errors?.tabDesc}
                                    helperText={errors?.tabDesc ? `${errors.tabDesc.message}` : null}
                                    {...register("tabDesc", {
                                        onChange: e => {
                                            handleChange(e, "tabDesc")
                                        },
                                    })}
                                />
                            )}
                        />
                        <Controller
                            name={`imageUpload`}
                            control={control}
                            render={() => (
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
                                        style: {
                                            visibility: "hidden",
                                            zIndex: 999,
                                        },
                                    }}
                                    InputProps={{
                                        startAdornment: (
                                            <Box
                                                component="img"
                                                src={
                                                    imageUrl !== ""
                                                        ? imageUrl
                                                        : "https://fakeimg.pl/250x200/?text=預覽圖&font=noto"
                                                }
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
                                                    bottom: "3%",
                                                }}>
                                                <Box
                                                    sx={{
                                                        display: "flex",
                                                        alignItems: "center",
                                                        cursor: "pointer",
                                                        color: "#323232",
                                                    }}>
                                                    <Typography>上傳商品圖片</Typography>
                                                    <PhotoCamera />
                                                </Box>
                                                <Button
                                                    sx={{
                                                        color: "#323232",
                                                    }}
                                                    onClick={e => {
                                                        handleRemoveImageFile(e, "imageUpload")
                                                    }}>
                                                    <Typography>刪除照片</Typography>
                                                    <DeleteIcon />
                                                </Button>
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
                                        onChange: e => {
                                            handleImageUpload(e)
                                        },
                                    })}
                                />
                            )}
                        />
                        {/* <Controller
                                    name={`tabImageUpload`}
                                    control={control}
                                    render={() => (
                                        <TextField
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
                                                startAdornment:
                                                    tabImageList.length <= 1 ? (
                                                        <Box
                                                            component="img"
                                                            src={
                                                                tabImageList[0]?.url !== undefined
                                                                    ? tabImageList[0]?.url
                                                                    : "https://fakeimg.pl/250x200/?text=預覽圖&font=noto"
                                                            }
                                                            sx={{
                                                                objectFit: "contain",
                                                                width: "250px",
                                                                height: "200px",
                                                            }}
                                                        />
                                                    ) : (
                                                        tabImageList.map((tabImage, index) => {
                                                            return (
                                                                <Box
                                                                    key={index}
                                                                    component="img"
                                                                    src={tabImage.url}
                                                                    sx={{
                                                                        objectFit: "contain",
                                                                        width: "250px",
                                                                        height: "200px",
                                                                        p: 1,
                                                                        border: "1px solid #999",
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
                                                            bottom: "3%",
                                                        }}>
                                                        <Box
                                                            sx={{
                                                                display: "flex",
                                                                alignItems: "center",
                                                                cursor: "pointer",
                                                                color: "#323232",
                                                            }}>
                                                            <Typography>上傳商品描述圖片</Typography>
                                                            <PhotoCamera />
                                                        </Box>
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
                                            {...register("tabImageUpload", {
                                                onChange: e => {
                                                    handleTabImageUpload(e)
                                                },
                                            })}
                                        />
                                    )}
                                /> */}
                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "center",
                                mt: 3,
                                width: {
                                    xs: "100%",
                                },
                            }}>
                            <Button
                                type="submit"
                                variant="contained"
                                onClick={handleSubmit(handleFormSubmit)}
                                sx={{
                                    height: "fit-content",
                                    width: {
                                        xs: "68%",
                                        md: "78%",
                                        lg: "78%",
                                    },
                                }}>
                                上傳商品
                            </Button>
                        </Box>
                    </Box>
                </>
            )}
        </Box>
    )
}

export default AddProduct
