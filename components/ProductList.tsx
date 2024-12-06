import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import api from '@/pages/api/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Search, Trash2 } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  image: string;
}

interface PaginatedResponse<T> {
  current_page: number;
  last_page: number;
  data: T[];
}

const ProductList: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  const fetchProducts = async (page = 1, query = '') => {
    try {
      const response = await api.get<PaginatedResponse<Product>>('/products', {
        params: { page, query },
      });
      setProducts(response.data.data);
      setCurrentPage(response.data.current_page);
      setLastPage(response.data.last_page);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const deleteProduct = async (id: number, event: React.MouseEvent) => {
    event.stopPropagation();
    try {
      await api.delete(`/products/${id}`);
      fetchProducts(currentPage, searchQuery);
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleCardClick = (id: number) => {
    router.push(`/product/${id}`);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handleSearchSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    fetchProducts(1, searchQuery);
  };

  const handlePageChange = (page: number) => {
    fetchProducts(page, searchQuery);
  };

  return (
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-6">Danh sách sản phẩm</h1>

        <Link href="/product-form" passHref>
          <Button className="mb-6">Tạo sản phẩm mới</Button>
        </Link>

        <form className="mb-4 flex" onSubmit={handleSearchSubmit}>
          <Input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="mr-2"
          />
          <Button type="submit" variant="outline">
            <Search className="h-4 w-4 mr-2" />
            Search
          </Button>
        </form>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
              <Card
                  key={product.id}
                  className="overflow-hidden relative cursor-pointer hover:shadow-lg transition-shadow duration-300"
                  onClick={() => handleCardClick(product.id)}
              >
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4 mb-4">
                    <Avatar className="w-16 h-16">
                      <AvatarImage src={`http://localhost:8000/storage/${product.image}`} alt={product.name} />
                      <AvatarFallback>{product.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h2 className="text-xl font-semibold">{product.name}</h2>
                      <Badge variant="secondary" className="mt-1">
                        {product.price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                      </Badge>
                    </div>
                  </div>
                  <p className="text-gray-600">{product.description}</p>
                </CardContent>
                <Button
                    variant="ghost"
                    size="icon"
                    className="absolute bottom-2 right-2 h-8 w-8 p-0 bg-white hover:bg-black group"
                    onClick={(e) => deleteProduct(product.id, e)}
                >
                  <Trash2 className="h-4 w-4 text-gray-500 group-hover:text-white" />
                </Button>
              </Card>
          ))}
        </div>

        {/* Pagination Controls */}
        <div className="flex justify-center mt-8 space-x-2">
          <Button
              variant="outline"
              disabled={currentPage === 1}
              onClick={() => handlePageChange(currentPage - 1)}
          >
            Previous
          </Button>
          <span className="px-4 py-2">{`Page ${currentPage} of ${lastPage}`}</span>
          <Button
              variant="outline"
              disabled={currentPage === lastPage}
              onClick={() => handlePageChange(currentPage + 1)}
          >
            Next
          </Button>
        </div>
      </div>
  );
};

export default ProductList;
