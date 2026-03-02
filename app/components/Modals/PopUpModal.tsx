import { useEffect, type ReactNode } from "react";

type CommentPopupModalTypes = {
  onClose: () => void;
  children: ReactNode;
};

export default function CommentPopUpModal({
  onClose,
  children,
}: CommentPopupModalTypes) {
  useEffect(() => {
    const scrollBarWidth =
      window.innerWidth - document.documentElement.clientWidth;

    document.body.style.overflow = "hidden";
    document.body.style.paddingRight = `${scrollBarWidth}px`;

    return () => {
      document.body.style.overflow = "auto";
      document.body.style.paddingRight = "0px";
    };
  }, []);
  return (
    <div className="fixed inset-0">
      <div onClick={onClose} className="fixed inset-0 bg-black/10"></div>
      <div
        className={`absolute flex flex-col justify-center w-1/3 p-4 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg gap-2`}
      >
        {children}
      </div>
    </div>
  );
}
