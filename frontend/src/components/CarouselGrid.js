import React from "react";

const CARD_WIDTH = 220;
const CARD_HEIGHT = 180;
const GAP = 16; // Tailwind gap-4 = 1rem = 16px

const PAGE_COLS = 3;
const PAGE_ROWS = 2;
const PAGE_SIZE = PAGE_COLS * PAGE_ROWS;
const PAGE_WIDTH = PAGE_COLS * CARD_WIDTH + (PAGE_COLS - 1) * GAP;
const PAGE_HEIGHT = PAGE_ROWS * CARD_HEIGHT + (PAGE_ROWS - 1) * GAP;

const CarouselGrid = ({ orders, renderOrderCard }) => {
  // For < 6 cards, calculate dynamic columns/rows
  const visibleCols = Math.min(orders.length, PAGE_COLS);
  const visibleRows = orders.length > PAGE_COLS ? Math.min(Math.ceil(orders.length / PAGE_COLS), PAGE_ROWS) : 1;
  const dynamicWidth = visibleCols * CARD_WIDTH + (visibleCols - 1) * GAP;
  const dynamicHeight = visibleRows * CARD_HEIGHT + (visibleRows - 1) * GAP;

  // For > 6 cards, use fixed page size
  const pageCount = Math.ceil(orders.length / PAGE_SIZE);

  return (
    <div
      className="overflow-x-auto transition-all duration-300"
      style={{
        width: orders.length <= PAGE_SIZE ? `${dynamicWidth}px` : `${PAGE_WIDTH}px`,
        minWidth: "220px",
        maxWidth: "100%",
        height: orders.length <= PAGE_SIZE ? `${dynamicHeight}px` : `${PAGE_HEIGHT}px`,
        maxHeight: "400px",
        background: "transparent",
      }}
    >
      {orders.length <= PAGE_SIZE ? (
        // Dynamic grid for up to 6 cards
        <div
          className="grid gap-4"
          style={{
            gridTemplateColumns: `repeat(${visibleCols}, ${CARD_WIDTH}px)`,
            gridTemplateRows: `repeat(${visibleRows}, ${CARD_HEIGHT}px)`,
            width: `${dynamicWidth}px`,
            height: `${dynamicHeight}px`,
            transition: "width 0.3s, height 0.3s",
          }}
        >
          {orders.map((order) => (
            <div key={order.orderId}>
              {renderOrderCard(order)}
            </div>
          ))}
        </div>
      ) : (
        // Horizontal "carousel" for more than 6 cards
        <div
          className="flex"
          style={{
            width: `${pageCount * PAGE_WIDTH}px`,
            height: `${PAGE_HEIGHT}px`,
          }}
        >
          {Array.from({ length: pageCount }).map((_, pageIdx) => (
            <div
              key={pageIdx}
              className="grid gap-4"
              style={{
                gridTemplateColumns: `repeat(${PAGE_COLS}, ${CARD_WIDTH}px)`,
                gridTemplateRows: `repeat(${PAGE_ROWS}, ${CARD_HEIGHT}px)`,
                width: `${PAGE_WIDTH}px`,
                height: `${PAGE_HEIGHT}px`,
                flex: "none",
              }}
            >
              {orders
                .slice(pageIdx * PAGE_SIZE, pageIdx * PAGE_SIZE + PAGE_SIZE)
                .map((order) => (
                  <div key={order.orderId}>
                    {renderOrderCard(order)}
                  </div>
                ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CarouselGrid;