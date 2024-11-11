import React from 'react';
import "./filterationBar.css";
import { Container } from 'react-bootstrap';

export default function FilterationBar() {
  const filterationTypes = [
    {
      id: 1,
      name: 'Chairs'
    },
    {
      id: 2 ,
      name: 'Sofas'
    },
    {
      id: 3,
      name: 'Electronics'
    },
    {
      id: 4,
      name: 'Home Decor'
    },
    {
      id: 5 ,
      name: 'Lighting'
    },
    {
      id: 6,
      name: 'Desks'
    },
    {
      id: 7 ,
      name: 'Tables'
    }
  ]

  return (
    <Container>
      <div className='row'>
        <div className='col-12'>
          <ul className="filterationBar d-flex justify-content-center flex-wrap">
            <li className={`filteration__item text-center px-3 py-3 ms-2 active`}>All</li>
            {
              filterationTypes.map(el=>{
                return(
                  <li className={`filteration__item text-center px-3 py-3`} key={el.id}>
                    {el.name}
                  </li>
                )
              })
            }
          </ul>
        </div>
      </div>
    </Container>
  );
};
