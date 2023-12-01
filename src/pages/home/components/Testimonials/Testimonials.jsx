import React, { useEffect, useState } from "react";
import NewsDataService from "../../../../service/news.service";
import Slider from "react-slick";
import { SERVER_APP } from "../../../../constants/config";
import Skeleton from "react-loading-skeleton";

function Testimonials(props) {
  const [List, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchData = async () => {
      const { data } = await NewsDataService.getBannerName("WEB.REVIEW");

      setList(data?.data || []);
      setLoading(false);
    };

    fetchData();
  }, []);

  const handStyle = () => {
    const _width = window.innerWidth - 30;
    return Object.assign({
      width: _width,
    });
  };

  const settingsNews = {
    className: "slider variable-width",
    dots: false,
    arrows: false,
    infinite: true,
    slidesToShow: 1,
    centerPadding: "20px",
    variableWidth: true,
    autoplay: true,
    autoplaySpeed: 5000,
  };

  return (
    <div className="bg-white my-8px p-15px">
      <div
        className="mb-15px"
        style={{
          textTransform: "uppercase",
          fontWeight: "700",
        }}
      >
        Ý kiến khách hàng
      </div>

      {loading && (
        <div
          className="p-15px"
          style={{ border: "1px solid #e5e7eb", borderRadius: "8px" }}
        >
          <div>
            {Array(5)
              .fill()
              .map((_, index) => (
                <svg
                  style={{
                    marginRight: "5px",
                  }}
                  key={index}
                  width={16}
                  version="1.1"
                  id="Capa_1"
                  xmlns="http://www.w3.org/2000/svg"
                  xmlnsXlink="http://www.w3.org/1999/xlink"
                  viewBox="0 0 47.94 47.94"
                  xmlSpace="preserve"
                >
                  <path
                    style={{ fill: "#ED8A19" }}
                    d="M26.285,2.486l5.407,10.956c0.376,0.762,1.103,1.29,1.944,1.412l12.091,1.757
	    c2.118,0.308,2.963,2.91,1.431,4.403l-8.749,8.528c-0.608,0.593-0.886,1.448-0.742,2.285l2.065,12.042
	    c0.362,2.109-1.852,3.717-3.746,2.722l-10.814-5.685c-0.752-0.395-1.651-0.395-2.403,0l-10.814,5.685
	    c-1.894,0.996-4.108-0.613-3.746-2.722l2.065-12.042c0.144-0.837-0.134-1.692-0.742-2.285l-8.749-8.528
	    c-1.532-1.494-0.687-4.096,1.431-4.403l12.091-1.757c0.841-0.122,1.568-0.65,1.944-1.412l5.407-10.956
	    C22.602,0.567,25.338,0.567,26.285,2.486z"
                  />
                </svg>
              ))}
          </div>
          <div className="mt-10px">
            <Skeleton height={8} />
            <Skeleton height={8} />
            <Skeleton height={8} />
            <Skeleton height={8} />
          </div>
        </div>
      )}
      {!loading && (
        <div>
          <Slider {...settingsNews}>
            {List &&
              List.map((item, index) => (
                <div key={index} style={{ ...handStyle() }}>
                  <div
                    className="p-15px"
                    style={{ border: "1px solid #e5e7eb", borderRadius: "8px" }}
                  >
                    <div>
                      {Array(5)
                        .fill()
                        .map((_, index) => (
                          <svg
                            style={{
                              marginRight: "5px",
                            }}
                            key={index}
                            width={16}
                            version="1.1"
                            id="Capa_1"
                            xmlns="http://www.w3.org/2000/svg"
                            xmlnsXlink="http://www.w3.org/1999/xlink"
                            viewBox="0 0 47.94 47.94"
                            xmlSpace="preserve"
                          >
                            <path
                              style={{ fill: "#ED8A19" }}
                              d="M26.285,2.486l5.407,10.956c0.376,0.762,1.103,1.29,1.944,1.412l12.091,1.757
	    c2.118,0.308,2.963,2.91,1.431,4.403l-8.749,8.528c-0.608,0.593-0.886,1.448-0.742,2.285l2.065,12.042
	    c0.362,2.109-1.852,3.717-3.746,2.722l-10.814-5.685c-0.752-0.395-1.651-0.395-2.403,0l-10.814,5.685
	    c-1.894,0.996-4.108-0.613-3.746-2.722l2.065-12.042c0.144-0.837-0.134-1.692-0.742-2.285l-8.749-8.528
	    c-1.532-1.494-0.687-4.096,1.431-4.403l12.091-1.757c0.841-0.122,1.568-0.65,1.944-1.412l5.407-10.956
	    C22.602,0.567,25.338,0.567,26.285,2.486z"
                            />
                          </svg>
                        ))}
                    </div>
                    <div
                      className="cut-text-7 mt-8px mb-12px"
                      dangerouslySetInnerHTML={{
                        __html: item.Desc,
                      }}
                    />
                    <div className="d--f ai--c">
                      <div style={{ width: "60px", height: "60px" }}>
                        <img
                          style={{
                            objectFit: "cover",
                            borderRadius: "100%",
                          }}
                          className="w-full h-full"
                          src={SERVER_APP + "/upload/image/" + item.FileName}
                          alt={item.Title}
                        />
                      </div>
                      <div className="f--1 pl-12px">
                        <div className="fw-600">{item.Title}</div>
                        <div>{item.Link}</div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </Slider>
        </div>
      )}
    </div>
  );
}

export default Testimonials;
