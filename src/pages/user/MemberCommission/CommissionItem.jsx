import React, { useEffect, useState } from "react";
import { checkAvt, formatPriceVietnamese } from "../../../constants/format";
import { AnimatePresence, motion } from "framer-motion/dist/framer-motion";
import { Sheet } from "framework7-react";
import userService from "../../../service/user.service";
import { createPortal } from "react-dom";
import moment from "moment";

function CommissionItem({ data }) {
  const [isOpen, setIsOpen] = useState(false);
  const [opened, setOpened] = useState(false);
  const [loading, setLoading] = useState(false);
  const [List, setList] = useState([]);

  useEffect(() => {
    if (opened) {
      getListOrder();
    }
  }, [opened]);

  const getListOrder = () => {
    setLoading(true);
    const memberPost = {
      MemberID: data?.ID,
    };
    userService
      .getForder(memberPost)
      .then(({ data }) => {
        setList(data.Lst);
        setLoading(false);
      })
      .catch((error) => console.log(error));
  };

  let ChildrenCount = window?.GlobalConfig?.APP?.ChildrenCount || 1000;

  return (
    <div className="border-bottom d--f p-15px">
      <div className="w-50px d--f jc--c ai--c" onClick={() => setOpened(true)}>
        <img className="rounded-circle" src={checkAvt("null.gif")} />
      </div>
      <div className="f--1 px-15px" onClick={() => setOpened(true)}>
        <div className="fw-600">{data.FullName}</div>
        <div className="text-muted2">{data?.MobilePhone}</div>
        <div className="text-primary">
          Đ.Hàng : {data?.OrderCount} -
          <span className="px-3px">
            Tổng : {formatPriceVietnamese(data?.OrderValue)}
          </span>
        </div>
        <div className="text-primary">
          H.Hồng :
          <span className="pl-3px">
            {formatPriceVietnamese(data?.FBonusValue)}
          </span>
        </div>
      </div>
      {data.level < ChildrenCount &&
        data.children &&
        data.children.length > 0 && (
          <div
            className="w-45px text-right d--f jc--e ai--c"
            onClick={() => setIsOpen(true)}
          >
            <i className="las la-angle-right"></i>
          </div>
        )}

      {createPortal(
        <AnimatePresence exitBeforeEnter>
          {isOpen && (
            <motion.div
              className="position-absolute w-100 h-100 top-0 left-0 bg-white d--f fd--c"
              initial={{ x: "100%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", bounce: 0, duration: 0.4 }}
            >
              <div
                className="position-relative"
                style={{ background: "#f1f1f1", padding: "15px" }}
              >
                <div
                  className="position-absolute w-45px h-100 top-0 left-0 d--f ai--c jc--c"
                  onClick={() => setIsOpen(false)}
                >
                  <i className="las la-angle-left"></i>
                </div>
                <div className="text-center fw-600 px-30px">
                  <span className="pr-5px">(F{data.level + 1})</span>
                  {data.FullName}
                  {data.children && data.children.length > 0 && (
                    <span className="pl-2px">
                      - {data.children.length} thành viên
                    </span>
                  )}
                </div>
              </div>
              <div className="fg--1 overflow-auto">
                {data.children &&
                  data.children.map((item, index) => (
                    <CommissionItem key={index} data={item} />
                  ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.getElementById("commission")
      )}

      <Sheet
        opened={opened}
        className="demo-sheet-swipe-to-step"
        style={{
          height:
            "calc(100% - calc(var(--f7-navbar-height) + var(--f7-safe-area-top)))",
          "--f7-sheet-bg-color": "#fff",
        }}
        onSheetClosed={() => setOpened(false)}
        backdrop
      >
        <div className="d--f fd--c h-100">
          <div className="p-15px border-bottom">
            <div className="fw-600">
              {data?.FullName} - {data?.MobilePhone}
            </div>
            <div className="text-primary">
              {data?.OrderCount} Đ.Hàng -
              <span className="px-3px">
                Tổng {formatPriceVietnamese(data?.OrderValue)}
              </span>
              <span className="px-3px">
                - {formatPriceVietnamese(data?.FBonusValue)}
              </span>
              H.Hồng
            </div>
          </div>
          <div className="fg--1 overflow-auto">
            {loading && "Đang tải ..."}
            {!loading && (
              <>
                {List &&
                  List.map((item, index) => (
                    <div className="p-15px border-bottom" key={index}>
                      <div className="fw-600">
                        Đơn hàng
                        <span className="text-danger pl-3px">
                          #{item.Order.ID}
                        </span>
                        <span className="pl-3px">
                          - {moment(item.Order.CreateDate).format("HH:mm DD-MM-YYYY")}
                        </span>
                      </div>
                      {item.Items &&
                        item.Items.map((order, idx) => (
                          <div className="d--f jc--sb mt-8px" key={idx}>
                            <div>
                              <div>{order?.ProdTitle}</div>
                              <div>{formatPriceVietnamese(order?.Price)}</div>
                            </div>
                            <div className="text-right">
                              <div>x{order?.Qty}</div>
                              <div>{formatPriceVietnamese(order?.ToPay)}</div>
                            </div>
                          </div>
                        ))}
                    </div>
                  ))}
              </>
            )}
          </div>
        </div>
      </Sheet>
    </div>
  );
}

export default CommissionItem;
