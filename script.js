

const API_URL = "https://fakestoreapi.com/products?limit=5"

const CHECK_URL = "https://jsonplaceholder.typicode.com/posts"


const productList  = [];
const products = document.getElementById("products");
let productsLoaded = false;

async function getProducts(){
    try{
        const res = await axios.get(API_URL)

        res.data.forEach((item)=>{
            productList.push({ id:item.id ,name: item.title, price: item.price });
        })

        const LoadBtn = document.getElementById('btn');

        LoadBtn.addEventListener('click',()=>{

            productList.forEach((item, index) => {
                const product = document.createElement("li");
                product.classList.add("product");
                product.id = `product${index}`;
                product.innerText = `${item.name} -- $${item.price}`
                products.appendChild(product);
                return 0;
            });

            products.classList.add("active");
            productsLoaded = true;

        },{ once: true })
    }
    catch (error){
        console.log(error)
    }
}

getProducts();

const couponReg = /^SAVE-[A-Z0-9]{4}$/;
const input = document.getElementById('couponInput');
const couponError = document.getElementById('couponError');
const applyBtn = document.getElementById('btn2');
let isCouponApplied = false;

applyBtn.addEventListener("click", () => {

    if(productsLoaded) {

        couponReg.test(input.value)
            ? (couponError.innerText = "Coupon applied: 10% off", couponError.style.color = "black", isCouponApplied = true)
            : (couponError.innerText = "Invalid Coupon", couponError.style.color = "red", isCouponApplied = false);

        if (isCouponApplied) {
            const allList = document.querySelectorAll("li");
            productList.forEach((item, i) => {
                const originalPrice = item.price;
                const discountedPrice = (originalPrice * 0.9).toFixed(2);
                allList[i].innerHTML = `${item.name} -- <span style="color:red;text-decoration: line-through;">${originalPrice}</span> <br>New Price: $${discountedPrice}`
            });
        } else {
            console.log('iscoupon yleobaa')
        }
    }
    else{
        console.log("products not loaded")
        couponError.innerText = "Products not loaded";
    }
    input.value = "";
});

const checkOut = document.getElementById("btn3");
const messages = document.getElementById("message");

async function postProduct() {
    try {
        if(!productsLoaded) return;

        let total = productList.reduce((sum, item) => sum + item.price, 0);
        if (isCouponApplied) {
            total = total * 0.9;
        }

        const response = await axios.post(CHECK_URL, {
            items: productList,
            coupon: isCouponApplied ? input.value : null,
            total: `Discount Applied: ${total.toFixed(2)}`
        });

        if (response.status === 201) {
            messages.innerText = `Order placed - ID: ${response.data.id}`;
        }
        console.log("Response:", response.data);



    } catch (error) {
        console.log("Checkout failed. Try again");
    }
}

checkOut.addEventListener('click', postProduct);





