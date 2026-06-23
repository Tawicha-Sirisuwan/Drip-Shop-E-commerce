"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";

interface Props {
  readonly currentPage: number;
  readonly totalPages: number;
  readonly totalItems: number;
  readonly itemsPerPage?: number;
}

export function AdminPagination({ currentPage, totalPages, totalItems, itemsPerPage = 10 } : Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  if (totalPages <= 1) return null;

  const startRecord = totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const endRecord = Math.min(currentPage * itemsPerPage, totalItems);

  const goToPage = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="px-6 py-4 border-t border-[#E5E5E5] flex items-center justify-between bg-white">
      <p className="text-sm text-[#666666]">
        แสดง <span className="font-medium text-black">{startRecord}</span> ถึง <span className="font-medium text-black">{endRecord}</span> จาก <span className="font-medium text-black">{totalItems}</span> รายการ
      </p>
      <div className="flex items-center gap-1">
        <button 
          onClick={() => goToPage(currentPage - 1)}
          disabled={currentPage === 1}
          className="w-8 h-8 flex items-center justify-center rounded border border-[#E5E5E5] text-[#666666] hover:text-black hover:border-gray-300 disabled:opacity-50 transition"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <span className="text-sm font-medium text-[#666666] px-2">
          หน้า {currentPage} จาก {totalPages}
        </span>
        <button 
          onClick={() => goToPage(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="w-8 h-8 flex items-center justify-center rounded border border-[#E5E5E5] text-[#666666] hover:text-black hover:border-gray-300 disabled:opacity-50 transition"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
