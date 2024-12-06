import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/router';
import api from '@/pages/api/api';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';

interface ProductFormValues {
  name: string;
  price: number;
  description: string;
  image: FileList;
}

const ProductForm: React.FC = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<ProductFormValues>();
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (data: ProductFormValues) => {
    setIsSubmitting(true);
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('price', data.price.toString());
    formData.append('description', data.description);
    if (data.image[0]) {
      formData.append('image', data.image[0]);
    }

    try {
      await api.post('/products', formData);
      toast({
        title: "Thành công",
        description: "Sản phẩm đã được tạo thành công",
        duration: 3000,
      });
      router.push('/');
    } catch (error) {
      console.error('Lỗi khi tạo sản phẩm:', error);
      toast({
        title: "Lỗi",
        description: "Không thể tạo sản phẩm. Vui lòng thử lại.",
        variant: "destructive",
        duration: 3000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <h2 className="text-2xl font-bold text-center">Tạo Sản Phẩm Mới</h2>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Tên sản phẩm</Label>
            <Input 
              id="name"
              {...register('name', { required: 'Tên sản phẩm là bắt buộc' })} 
              placeholder="Nhập tên sản phẩm" 
            />
            {errors.name && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{errors.name.message}</AlertDescription>
              </Alert>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Mô tả</Label>
            <Textarea 
              id="description"
              {...register('description', { required: 'Mô tả là bắt buộc' })} 
              placeholder="Nhập mô tả sản phẩm" 
            />
            {errors.description && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{errors.description.message}</AlertDescription>
              </Alert>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="price">Giá</Label>
            <Input 
              id="price"
              type="number" 
              {...register('price', { required: 'Giá là bắt buộc', min: 0 })} 
              placeholder="Nhập giá" 
            />
            {errors.price && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{errors.price.message}</AlertDescription>
              </Alert>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="image">Hình ảnh</Label>
            <Input 
              id="image"
              type="file" 
              {...register('image', { required: 'Hình ảnh là bắt buộc' })} 
            />
            {errors.image && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{errors.image.message}</AlertDescription>
              </Alert>
            )}
          </div>
        </form>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleSubmit(onSubmit)} 
          className="w-full"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Đang tạo...' : 'Tạo Sản Phẩm'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductForm;