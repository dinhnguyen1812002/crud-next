import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

import api from '@/pages/api/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Edit } from 'lucide-react';

interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  image: string;
}

const ProductDetail: React.FC = () => {
  const [product, setProduct] = useState<Product | null>(null);
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    const fetchProduct = async () => {
      if (id) {
        try {
          const response = await api.get(`/products/${id}`);
          setProduct(response.data);
        } catch (error) {
          console.error('Error fetching product:', error);
        }
      }
    };

    fetchProduct();
  }, [id]);

  if (!product) {
    return <div className="text-center mt-8">Đang tải...</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <Button
        variant="ghost"
        className="mb-4"
        onClick={() => router.push('/')}
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> Quay lại danh sách
      </Button>

      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <h1 className="text-3xl font-bold">{product.name}</h1>
          <Badge variant="secondary" className="mt-2 text-lg">
            {product.price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
          </Badge>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative h-64 w-full">
          <img src={`http://localhost:8000/storage/${product.image}`} alt={product.name}  />
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-2">Mô tả sản phẩm</h2>
            <p className="text-gray-600">{product.description}</p>
          </div>
        </CardContent>
        <CardFooter className="justify-end">
          <Button
            onClick={() => router.push(`/product-edit/${product.id}`)}
          >
            <Edit className="mr-2 h-4 w-4" /> Chỉnh sửa sản phẩm
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ProductDetail;