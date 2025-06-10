import "./Carousel.css";


function Carousel () {
  return (
    <div className="carousel">
      <div className="carousel__left-button"></div>
    <div className="carousel__right-button"></div>
  <ul className="carousel__window">
        <li className="carousel__card">
        <div className="carousel__card-image"></div>
        <div className="carousel__card-location">Park Location 1</div>
    </li>
    <li className="carousel__card">
            <div className="carousel__card-image">{}</div>
        <div className="carousel__card-location">{}</div>
    </li>
    <li className="carousel__card">
              <div className="carousel__card-image"></div>
        <div className="carousel__card-location">Park Location 3</div>
    </li>
    <li className="carousel__card">
             <div className="carousel__card-image"></div>
        <div className="carousel__card-location">Park Location 4</div>
    </li>
    <li className="carousel__card">
             <div className="carousel__card-image"></div>
        <div className="carousel__card-location">Park Location 5</div>
    </li>
    <li className="carousel__card">
             <div className="carousel__card-image"></div>
        <div className="carousel__card-location">Park Location 6</div>
    </li>
    <li className="carousel__card">
             <div className="carousel__card-image"></div>
        <div className="carousel__card-location">Park Location 7</div>
    </li>
  </ul>
    </div>
  );
}

export default Carousel;