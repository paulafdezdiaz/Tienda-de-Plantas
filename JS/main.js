let compraFinal ={};

function init(){
    paintProducts()
    createDivCarrito()
    clickCompra()
    close()
    vaciarCarrito()
    buscar()

}
init()

function paintProducts(){

    let $products = document.createElement('div');
    $products.classList.add('productos');
    
    let $footer = document.querySelector('footer');
    document.body.insertBefore($products, $footer)


    for(let plantas of products){
        let $pill = document.createElement('div');
        $pill.classList.add('products-pill');
        $products.appendChild($pill);
        $pill.dataset.id = plantas.id;
        $pill.dataset.name = plantas.productName;
        $pill.dataset.price = plantas.precio;
        $pill.dataset.stock = plantas.stock;
        let $plantHeader = document.createElement('div');
        $pill.appendChild($plantHeader);
        $plantHeader.classList.add('plantHeader');
        $plantHeader.innerHTML = `
            <img src="${plantas.image}" alt="${plantas.productName}"/>
        `;
    
        let $plantBody= document.createElement('div');
        $pill.appendChild($plantBody);
        $plantBody.classList.add('plantBody');
        $plantBody.innerHTML = `
            <div class= 'nameInfo'>
                <h4>${plantas.productName}</h4>
                <button class="informacion fa-solid fa-info"></button>
            </div>
            <span>${plantas.precio}€</span>
            <button class='buybtn'>Añadir al carrito</button>
            <div id='infoDiv' class='info'>
                <h4 class='titulo hidden'>${plantas.descripcionTitulo}</h4>
                <p class='descr hidden'>${plantas.descripcion}</p>
            </div

        `   
        let $buybtn = $plantBody.querySelector('.buybtn');
        $buybtn.addEventListener('click', anadirAlCarrito);


        function anadirAlCarrito(){
            let $pill = this.closest('.products-pill')

            let id = $pill.dataset.id;
            let product = $pill.dataset.name;
            let price = $pill.dataset.price;
            let stock = $pill.dataset.stock;
        
            if(!compraFinal.hasOwnProperty(id)){
                compraFinal[id]= {
                    id: parseInt(id),
                    product: product,
                    price: parseInt(price),
                    count: 0,
                    stock: parseInt(stock)
                }
            }

            acciones(id,1)
            resetearCarrito()
        }
            let $infobtn = $plantBody.querySelector('.informacion');
            $infobtn.addEventListener('click', moreInfoBtn);
            
            function moreInfoBtn(){
                let $infoDiv = $plantBody.querySelector('.info');
                $infoDiv.classList.toggle('show')

                let $titulo = $plantBody.querySelector('.titulo');
                $titulo.classList.toggle('hidden')

                let $description = $plantBody.querySelector('.descr');
                $description.classList.toggle('hidden')

            }

        }
    }

function resetearCarrito(){
    let $listBody = document.querySelector('#listaProductos');
    $listBody.innerHTML = ``;

    let precioTotal = 0
    for(let compra in compraFinal){
        let planta = compraFinal[compra];
        let $trBody = document.createElement('tr')
        $trBody.dataset.id = planta.id
        $listBody.appendChild($trBody)
        $trBody.innerHTML =`
            <td class='item'>${planta.product}</td>
            <td class='precio'>${planta.price}€</td>
            <td class='cantidad'>
                ${planta.count}
                <div class='acciones'>
                    <button class="plus fa-solid fa-plus"></button>
                    <button class="minus fa-solid fa-minus"></button>
                </div>
            </td>
            <td class='subtotal'>${planta.price * planta.count}€</td>
            <td class='borrar'>
                <button class=" borrarBtn fa-solid fa-trash"></button>
            </td>
    
        `
        let $plus = $trBody.querySelector('.plus')
        $plus.addEventListener('click', accionSumar)


        let $minus = $trBody.querySelector('.minus')
        $minus.addEventListener('click', accionRestar)

        let $remove = $trBody.querySelector('.borrarBtn')
        $remove.addEventListener('click', accionBorrar)
        
        function accionSumar(){ 
            let $sumar = this.closest('tr');
            let plantaId = parseInt($sumar.dataset.id);
            acciones(plantaId, 1);
        
        
        }

        function accionRestar(){ 
            let $restar = this.closest('tr');
            let plantaId = parseInt($restar.dataset.id);
            acciones(plantaId, -1);
        
        }
        
        function accionBorrar(){
            let $borrar = this.closest('tr');
            let plantaId = parseInt($borrar.dataset.id);
            delete compraFinal[plantaId]
        
            resetearCarrito()
        }

        precioTotal += planta.price * planta.count

    }
        let $total = document.querySelector('.total')
        $total.textContent = precioTotal + '€'
}




function acciones(plantaId, change){
    if(!compraFinal.hasOwnProperty(plantaId)){
        console.error('el producto no se encuentra en el carrito');
        return
    }
    if(compraFinal[plantaId].count + change >compraFinal[plantaId].stock){
        alert('soldOut')

    }else{
        compraFinal[plantaId].count += change;
        if(compraFinal[plantaId].count <= 0 ){
            delete compraFinal[plantaId]
          
        } 
    }
    resetearCarrito()
}

function createDivCarrito(){
    let $compra = document.createElement('div');
    $compra.classList.add('hidden');
    $compra.classList.add('show');
    $compra.setAttribute('id', 'lista')
    let $compradiv = document.querySelector('.compra');
    $compradiv.appendChild($compra)

    $compra.innerHTML = `
        <i id="close" class="fa-solid fa-xmark"></i>
        <h3 class='tuCompra'>Tu compra</h3>
        <table id='listaCompra' class='list'>
            <thead>
                <tr>
                    <th>Item</th>
                    <th>Precio</th>
                    <th>Cantidad</th>
                    <th>Subtotal</th>
                    <th></th>
                </tr>
            </thead> 
            <tbody id=listaProductos>
            </tbody>   
        </table>
        <div class='precioTotal'>
            Total: <span class='total'></span>
        </div>
        <button class='comprar'>Comprar</button>
        <button class='limpiarCarrito'>Vaciar Carrito</button>
    
    `

    let $carritobtn = document.querySelector('#shoppingList');
    $carritobtn.addEventListener('click', clickCompra);


    let $closebtn = document.querySelector('#close');
    $closebtn.addEventListener('click', close);

    let $buy = document.querySelector('.comprar')
    $buy.addEventListener('click', realizarCompra);
    
    let $vaciar = document.querySelector('.limpiarCarrito')
    $vaciar.addEventListener('click', vaciarCarrito);

}

function clickCompra(){
    let $listaCompra = document.getElementById('lista');
    $listaCompra.classList.remove('hidden');

}


function close(){
    let $listaCompra = document.getElementById('lista');
    $listaCompra.classList.add('hidden');
}



function realizarCompra(){
    if(Object.keys(compraFinal).length <= 1){
        alert('compra no disponible, carrito vacio');
    }else{
        alert('compra realizada')
        compraFinal = {}
        resetearCarrito()

    }
    
}

function vaciarCarrito(){
    compraFinal = {}
    resetearCarrito()
}

function buscar(){
    $search = document.querySelector('.buscar')
    $search.addEventListener('click', busqueda)

    function busqueda(){
        let $buscarInput = document.getElementById('busqueda');
        $buscarInput.classList.toggle('hidden');

    }

}






