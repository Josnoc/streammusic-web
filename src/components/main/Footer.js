import React from 'react';

export default function Footer(){
    const currentDate=()=>{let dat= new Date();return dat.getFullYear();}

	return(

		<footer className="main-footer footer text-center">
			<strong >
				Copyright © {currentDate()}
			</strong>

		</footer>

	)

}