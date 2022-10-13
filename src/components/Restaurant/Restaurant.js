import React, { useEffect, useState } from 'react';
import Meal from '../Meal/Meal';
import OrderList from '../OrderList/OrderList';
import './Restaurant.css';
import {addToDb,getStoredCart} from '../../utilities/fakedb'

const Restaurant = () => {
    const [meals, setMeals] = useState([]);
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        fetch('https://www.themealdb.com/api/json/v1/1/search.php?s=fish')
            .then(res => res.json())
            .then(data => setMeals(data.meals));
    }, []);
   
    // console.log(meals)

    const handleAddToCart =(meal)=>{
        // console.log(meal)
        let cartItems = [];
        const exists = orders.find(m => m.idMeal === meal.idMeal);
        if(!exists){
            meal.quantity  = 1;
            cartItems = [...orders, meal]
        }
        else{
            const rest = orders.filter(m=> m.idMeal !== meal.idMeal)
            exists.quantity = exists.quantity + 1;
            cartItems = [...rest, exists]
        }
        setOrders(cartItems)
        addToDb(meal.idMeal)
    }

    useEffect(()=>{
        const storedCart = getStoredCart();
        // console.log(getItemsFromDb)
        let items = [];
        for(const id in storedCart){
            const addedMeals = meals.find(m => m.idMeal === id)
            console.log(addedMeals)
            if(addedMeals){
                const quantity = storedCart[id]
                addedMeals.quantity = quantity;
                items.push(addedMeals)
            }
        }
        setOrders(items)
    },[meals])

    

    return (
        <div className="restaurant-menu">
            <div className="meals-container">
                {
                    meals.map(meal => <Meal
                        key={meal.idMeal}
                        meal={meal}
                        handleAddToCart={handleAddToCart}
                    ></Meal>)
                }
            </div>
            <div className="order-list">
                <OrderList orders={orders}></OrderList>
            </div>
        </div>

    );
};

export default Restaurant;