import React, { useState } from "react";
import { checkAvt } from "../../../constants/format";
import { AnimatePresence, motion } from "framer-motion/dist/framer-motion";

function CommissionItem({ data }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <AnimatePresence exitBeforeEnter>
      <div className="border-bottom d--f p-15px">
        <div className="w-50px d--f jc--c ai--c">
          <img className="rounded-circle" src={checkAvt("null.gif")} />
        </div>
        <div className="f--1 px-15px">
          <div className="fw-600">{data.Title}</div>
          <div className="text-muted2">{data?.Phone}</div>
          <div className="text-primary">80 Đ.Hàng - H.Hồng 250.000</div>
        </div>
        {data.Children && data.Children.length > 0 && (
          <div
            className="w-45px text-right d--f jc--e ai--c"
            onClick={() => setIsOpen(true)}
          >
            <i className="las la-angle-right"></i>
          </div>
        )}

        {isOpen && (
          <motion.div
            className="position-absolute w-100 h-100 top-0 left-0 bg-white"
            initial={{ x: "100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "100%", opacity: 0 }}
            transition={{ type: "spring", bounce: 0, duration: 0.4 }}
          >
            <div className="d--f">
              <div onClick={() => setIsOpen(false)}>
                <i className="las la-angle-left"></i>
              </div>
              <div>{data.Title} [1500]</div>
            </div>
            {data.Children &&
              data.Children.map((item, index) => (
                <CommissionItem key={index} data={item} />
              ))}
          </motion.div>
        )}
      </div>
    </AnimatePresence>
  );
}

export default CommissionItem;
