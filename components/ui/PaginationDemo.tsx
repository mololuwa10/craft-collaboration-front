import {
	Pagination,
	PaginationContent,
	PaginationEllipsis,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from "@/components/ui/pagination";

interface PaginationProps {
	totalPages: number;
	paginate: (page: number) => void;
	currentPage: number;
}

export function PaginationComponent({
	totalPages,
	paginate,
	currentPage,
}: PaginationProps) {
	return (
		<Pagination className="mt-8">
			<PaginationContent>
				<PaginationItem>
					<PaginationPrevious
						href="#"
						onClick={() => paginate(currentPage - 1)}
					/>
				</PaginationItem>

				{Array.from({ length: totalPages }, (_, index) => (
					<PaginationItem key={index} className="text-black">
						<PaginationLink
							href="#"
							onClick={() => paginate(index + 1)}
							isActive={currentPage === index + 1}>
							{index + 1}
						</PaginationLink>
					</PaginationItem>
				))}

				<PaginationItem>
					<PaginationNext href="#" onClick={() => paginate(currentPage + 1)} />
				</PaginationItem>
			</PaginationContent>
		</Pagination>
	);
}
