import React, {useState} from 'react';
import {Container} from "react-bootstrap";
import SearchBarSection from "./SearchBarSection";
import ProductCategorySection from "./ProductCategorySection";
import ProductCardsSection from "./ProductCardSection";

const  ProductCartSectionDOM: React.FC = () => {
  const [categoryName, setCategoryName] = useState<string>('All');

  return (
    <Container className="product-cart-cont  px-xl-4 px-lg-4 px-0 ">
      <SearchBarSection/>
      <ProductCategorySection selectedCategory={categoryName} setSelectedCategory={setCategoryName}/>
      {(categoryName === 'All') ?
        <>
          {/* <ProductCardsSection categoryName={"Grocery"}/>
          <ProductCardsSection categoryName={"Food"}/> */}
          <ProductCardsSection categoryName={"Beverages"}/>
        </>
        // : (categoryName === 'Grocery') ?
        //   <ProductCardsSection categoryName={"Grocery"}/>
        //     : (categoryName === 'Food') ?
        //       <ProductCardsSection categoryName={"Food"}/>
              : <ProductCardsSection categoryName={"Beverages"}/>
      }
    </Container>
  )
}

export default ProductCartSectionDOM;
