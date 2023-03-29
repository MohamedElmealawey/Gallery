const imageWrapper=document.querySelector(".gallery .images");
const loadMoreBtn=document.querySelector(".gallery .load-more");
const searchInput=document.querySelector(".search-box input");
const lightBox=document.querySelector(".lightbox");
const closeBtn=lightBox.querySelector(".buttons .fa-times");
const downloadImgBtn=lightBox.querySelector(".buttons .fa-download");

const apiKey="ITKOxQhAX33qGQCIuiJDWlTDITCTlJVEAYTTnMZmM3PYL9e23J8VGTFx";
const perPage=15;
let currentPage=1;
let searchTerm=null;

const downloadImg = (imgURL) => {
    fetch(imgURL).then(res => res.blob()).then(file => {
        const a=document.createElement("a");
        a.href=URL.createObjectURL(file);
        a.download=new Date().getTime();
        a.click();
    }).catch(() => alert("Failed to download image!"));
}

const showLightbox= (name,img) =>{
    lightBox.querySelector("img").src=img;
    lightBox.querySelector("span").innerText=name;
    downloadImgBtn.setAttribute("data-img", img);
    lightBox.classList.add("show");
    document.body.style.overflow="hidden";
}

const hideLightBox = () =>{
    lightBox.classList.remove("show");
    document.body.style.overflow="auto";
}

const generateHTML=(images)=>{
    imageWrapper.innerHTML += images.map(img =>
        `<li class="card" onclick="showLightbox('${img.photographer}','${img.src.large2x}')">
            <img src="${img.src.large2x}" alt="img">
            <div class="details">
                <div class="photographer">
                    <i class="fas fa-camera"></i>
                    <span>${img.photographer}</span>
                </div>
                <button onclick="downloadImg('${img.src.large2x}');event.stopPropagation();">
                    <i class="fas fa-download"></i>
                </button>
            </div>
        </li>`
    ).join("");
}

const getImages=(apiUrl)=>{
    //Featching images by api call with authorization header
    loadMoreBtn.innerText="Loading...";
    loadMoreBtn.classList.add("disabled");
    fetch(apiUrl,{
        headers: {Authorization: apiKey}
    }).then(res => res.json()).then(data => {
        generateHTML(data.photos);
        loadMoreBtn.innerText="Load More";
        loadMoreBtn.classList.remove("disabled");
    }).catch(() => alert("Failed to load images!"));
}

const loadMoreImages=()=>{
    currentPage++; //Increament CurrentPage  by 1
    let apiURL=`https://api.pexels.com/v1/curated?page=${currentPage}&per_page=${perPage}`;
    apiURL=searchTerm ? `https://api.pexels.com/v1/search?query=${searchTerm}&page=${currentPage}&per_page=${perPage}`: apiURL;
    getImages(apiURL);
}

const loadSearchImages= (e)=>{
    if(e.target.value==="") return searchTerm=null;
    if(e.key ==="Enter"){
        currentPage =1;
        searchTerm=e.target.value;
        imageWrapper.innerHTML="";
        getImages(`https://api.pexels.com/v1/search?query=${searchTerm}&page=${currentPage}&per_page=${perPage}`)
    }
}

getImages(`https://api.pexels.com/v1/curated?page=${currentPage}&per_page=${perPage}`);

loadMoreBtn.addEventListener("click",loadMoreImages);
searchInput.addEventListener("keyup",loadSearchImages);
closeBtn.addEventListener("click",hideLightBox);
downloadImgBtn.addEventListener("click",(e)=> downloadImg(e.target.dataset.img));