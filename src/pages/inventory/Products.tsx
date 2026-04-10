import { motion, AnimatePresence } from 'motion/react';
import { Filter, PlusCircle, Search, ChevronLeft, ChevronRight, Edit2, Trash2, Barcode, Package, AlertTriangle, TrendingUp, X, Check, List, LayoutGrid, Eye } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';
import { Select } from '../../components/ui/Select';
import { ErrorState } from '../../components/ui/ErrorState';
import { Modal } from '../../components/ui/Modal';
import { ConfirmModal } from '../../components/ui/ConfirmModal';
import { ProductForm } from '../../components/form/ProductForm';
import { TableHeader, Pagination } from '../../components/table';
import { ProductInput } from '../../lib/validations';
import { formatCurrency } from '../../lib/formatters';
import { useStores } from '../Stock/useStores';

import { useInventory } from './useInventory';
import { useCategories } from './useCategories';
import { Product } from '../../types';
import { Loading } from '../../components/ui/Loading';

export function Products() {
  const { products, isLoading, error: fetchError, createProduct, updateProduct, deleteProduct, uploadImage } = useInventory();
  const { categories, createCategory, updateCategory, deleteCategory } = useCategories();
  const { stores } = useStores();
  const activeStore = stores[0];
  const currencySymbol = activeStore?.currency_symbol || '$';

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [editingCategoryName, setEditingCategoryName] = useState('');
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const [categoryFilter, setCategoryFilter] = useState<string>('All Items');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);

  const filteredProducts = products.filter(product => {
    const matchesCategory = categoryFilter === 'All Items' || product.category?.name === categoryFilter;
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch =
      product.name.toLowerCase().includes(searchLower) ||
      (product.brand?.toLowerCase() || '').includes(searchLower) ||
      (product.model?.toLowerCase() || '').includes(searchLower) ||
      (product.barcode?.toLowerCase() || '').includes(searchLower);

    return matchesCategory && matchesSearch;
  });

  // Pagination
  const total = filteredProducts.length;
  const startIndex = (page - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, total);
  const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

  // reset to page 1 when filters change
  useEffect(() => {
    setPage(1);
  }, [categoryFilter, searchQuery, products, pageSize]);

  const handleSubmitProduct = async (data: ProductInput, imageFile?: File | null) => {
    try {
      let productData = { ...data } as Partial<Product>;

      // Upload image if provided
      if (imageFile) {
        const publicUrl = await uploadImage.mutateAsync(imageFile);
        productData.image = publicUrl;
      }

      if (editingId) {
        console.log('Updating product with data:', productData);
        await updateProduct.mutateAsync({ id: editingId, updates: productData });
      } else {
        await createProduct.mutateAsync(productData);
      }

      setIsModalOpen(false);
      setEditingId(null);
      setEditingProduct(null);
    } catch (err) {
      console.error('Failed to save product:', err);
    }
  };

  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) return;
    try {
      await createCategory.mutateAsync(newCategoryName);
      setNewCategoryName('');
    } catch (err) {
      console.error('Failed to add category:', err);
    }
  };

  const handleUpdateCategory = async (id: string) => {
    if (!editingCategoryName.trim()) return;
    try {
      await updateCategory.mutateAsync({ id, name: editingCategoryName });
      setEditingCategoryId(null);
      setEditingCategoryName('');
    } catch (err) {
      console.error('Failed to update category:', err);
    }
  };

  const handleEditClick = (product: Product) => {
    const editPayload = {
      name: product.name,
      category_id: product.category_id,
      brand: product.brand || '',
      model: product.model || '',
      cost_price: product.cost_price ?? 0,
      unit_price: product.unit_price ?? 0,
      barcode: product.barcode || '',
      stock_value: product.stock_value ?? 0,
      type: product.type || 'Physical',
      status: product.status || 'Active',
      description: product.description || '',
      image: product.image || '',
    };
    // eslint-disable-next-line no-console
    // console.log('Products: handleEditClick editPayload ->', editPayload);
    setEditingProduct(editPayload);
    setEditingId(product.product_id);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (id: string) => {
    setProductToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const processDelete = async () => {
    if (!productToDelete) return;
    try {
      await deleteProduct.mutateAsync(productToDelete);
      setIsDeleteModalOpen(false);
      setProductToDelete(null);
    } catch (err) {
      console.error('Failed to delete product:', err);
    }
  };

  const handleOpenAddModal = () => {
    setEditingId(null);
    setEditingProduct({
      name: '',
      category_id: categories.length > 0 ? categories[0].category_id : '',
      brand: '',
      model: '',
      cost_price: 0,
      unit_price: 0,
      barcode: '',
      stock_value: 0,
      type: 'Physical',
      status: 'Active',
      description: '',
      image: '',
    });
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setEditingProduct(null);
  };

  if (fetchError) {
    return (
      <div className="h-[calc(100vh-120px)] flex items-center justify-center">
        <ErrorState onRetry={() => window.location.reload()} />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h2 className="text-4xl font-headline font-extrabold text-on-surface tracking-tight mb-2">Inventory Management</h2>
          <p className="text-on-surface-variant font-medium">Manage your products, categories, and stock levels across all regions.</p>
        </div>
        <div className="flex gap-4">
          <Button variant="secondary" onClick={() => setIsCategoryModalOpen(true)}>
            <Filter size={18} />
            Manage Categories
          </Button>
          <Button onClick={handleOpenAddModal}>
            <PlusCircle size={18} />
            Add New Product
          </Button>
        </div>
      </div>

      {/* Category Management Modal */}
      <Modal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        title="Manage Categories"
      >
        <div className="space-y-6">
          <div className="flex gap-2">
            <Input
              placeholder="New Category Name"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              className="flex-1"
            />
            <Button onClick={handleAddCategory} loading={createCategory.isPending}>
              Add
            </Button>
          </div>

          <div className="space-y-2 max-h-[300px] overflow-y-auto">
            {categories.map((cat) => (
              <div key={cat.category_id} className="flex items-center justify-between p-3 bg-surface-container-low rounded-sm border border-outline-variant/10">
                {editingCategoryId === cat.category_id ? (
                  <div className="flex items-center gap-2 flex-1 mr-2">
                    <Input
                      value={editingCategoryName}
                      onChange={(e) => setEditingCategoryName(e.target.value)}
                      className="h-8 py-1 text-sm flex-1"
                      autoFocus
                    />
                    <button
                      onClick={() => handleUpdateCategory(cat.category_id)}
                      className="p-1.5 text-primary hover:text-primary-container transition-colors"
                      title="Save"
                    >
                      <Check size={16} />
                    </button>
                    <button
                      onClick={() => setEditingCategoryId(null)}
                      className="p-1.5 text-on-surface-variant hover:text-on-surface transition-colors"
                      title="Cancel"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <span className="font-medium text-sm text-on-surface">{cat.name}</span>
                )}

                <div className="flex items-center gap-1">
                  {editingCategoryId !== cat.category_id && (
                    <button
                      onClick={() => {
                        setEditingCategoryId(cat.category_id);
                        setEditingCategoryName(cat.name);
                      }}
                      className="p-2 text-on-surface-variant hover:text-primary hover:bg-primary/5 rounded-md transition-all"
                      title="Edit Category"
                    >
                      <Edit2 size={16} />
                    </button>
                  )}
                  <button
                    onClick={() => deleteCategory.mutate(cat.category_id)}
                    className="p-2 text-on-surface-variant hover:text-error hover:bg-error/5 rounded-md transition-all"
                    title="Delete Category"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Modal>

      {/* Product Form Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCancel}
        title={editingId ? 'Edit Product' : 'Add New Product'}
      >
        {(createProduct.isError || updateProduct.isError) && (
          <div className="p-4 mb-6 bg-error/10 border border-error/20 rounded-sm flex items-center gap-3 text-error">
            <AlertTriangle size={18} />
            <p className="text-xs font-bold uppercase tracking-widest">
              {(createProduct.error as Error)?.message || (updateProduct.error as Error)?.message || 'Failed to save product'}
            </p>
          </div>
        )}
        <ProductForm
          categories={categories}
          initialData={editingProduct || undefined}
          onSubmit={handleSubmitProduct}
          onCancel={handleCancel}
          isSubmitting={createProduct.isPending || updateProduct.isPending || uploadImage.isPending}
        />
      </Modal>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-5 bg-primary/5 border-primary/10">
          <div className="flex items-center justify-between mb-3">
            <span className="p-2 bg-primary/10 text-primary rounded-md">
              <Package size={20} />
            </span>
            <Badge variant="primary" className="font-mono tracking-tighter">{categories.length} Categories</Badge>
          </div>
          <h3 className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Active Categories</h3>
          <p className="text-2xl font-headline font-bold text-on-surface mt-1">
            {categories.length > 0 ? categories[0].name : 'None'}
          </p>
        </Card>

        <Card className="p-5 bg-error/5 border-error/10">
          <div className="flex items-center justify-between mb-3">
            <span className="p-2 bg-error/10 text-error rounded-md">
              <AlertTriangle size={20} />
            </span>
            <Badge variant="error" className="font-mono tracking-tighter">8 Items</Badge>
          </div>
          <h3 className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Low Stock Alert</h3>
          <p className="text-2xl font-headline font-bold text-on-surface mt-1">Restock Soon</p>
        </Card>

        <div className="md:col-span-2 bg-surface-container p-6 rounded-sm shadow-xl flex items-center justify-between text-on-surface overflow-hidden relative border border-outline-variant/10">
          <div className="relative z-10">
            <h3 className="text-[10px] font-bold opacity-80 uppercase tracking-widest">Inventory Value</h3>
            <p className="text-4xl font-mono font-extrabold mt-1">{formatCurrency(142508.00, { currencySymbol })}</p>
            <div className="mt-4 flex items-center gap-2">
              <TrendingUp size={16} className="text-primary" />
              <span className="text-xs font-mono font-bold text-primary">+12.5% from last month</span>
            </div>
          </div>
          <div className="opacity-5 absolute right-[-20px] top-[-20px]">
            <Barcode size={180} />
          </div>
        </div>
      </div>

      {/* Products Table/Grid */}
      <Card className="overflow-hidden" variant="elevated">
        <TableHeader>
          <div className="flex items-center gap-2 min-w-[200px]">
            <Select
              size="small"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-surface-container"
            >
              <option value="All Items">All Categories</option>
              {categories.map(cat => (
                <option key={cat.category_id} value={cat.name}>{cat.name}</option>
              ))}
            </Select>
          </div>

          <div className="flex-1 max-w-md">
            <Input
              placeholder="Search products..."
              icon={<Search size={18} />}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-surface-container"
            />
          </div>

          <div className="flex items-center gap-3">
            <div className="flex bg-surface-container-high p-1 rounded-lg border border-outline-variant/10">
              <button
                onClick={() => setViewMode('table')}
                className={`p-2 rounded-md transition-all ${viewMode === 'table' ? 'bg-primary text-on-primary shadow-md' : 'text-on-surface-variant hover:bg-surface-container-highest'}`}
              >
                <List size={18} />
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-md transition-all ${viewMode === 'grid' ? 'bg-primary text-on-primary shadow-md' : 'text-on-surface-variant hover:bg-surface-container-highest'}`}
              >
                <LayoutGrid size={18} />
              </button>
            </div>
          </div>
        </TableHeader>

        {isLoading ? (
          <div className="p-10 flex justify-center"><Loading /></div>
        ) : (
          <AnimatePresence mode="wait">
            {viewMode === 'table' ? (
              <motion.div
                key="table-view"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="overflow-x-auto"
              >
                <table className="w-full text-left">
                  <thead className="bg-surface-container-highest/30 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/60">
                    <tr>
                      <th className="px-8 py-4">Product Details</th>
                        <th className="px-8 py-4">Category</th>
                        <th className="px-8 py-4">Barcode</th>
                        <th className="px-8 py-4">Price</th>
                        <th className="px-8 py-4">Stock</th>
                        <th className="px-8 py-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-outline-variant/10">
                      {paginatedProducts.map((product) => (
                        <tr key={product.product_id} className="group hover:bg-surface-container-low/30 transition-colors">
                          <td className="px-8 py-5">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 rounded-md bg-surface-container-high overflow-hidden border border-outline-variant/20">
                                <img src={product.image_url || product.image} alt={product.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                              </div>
                              <div>
                                <Link to={`/inventory/product/${product.product_id}`} className="hover:underline">
                                  <p className="text-sm font-bold text-on-surface">{product.name}</p>
                                </Link>
                                <p className="text-[10px] text-on-surface-variant font-medium line-clamp-1">{product.brand} {product.model}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-8 py-5">
                            <Badge variant="secondary">{product.category?.name}</Badge>
                          </td>
                          <td className="px-8 py-5 font-mono text-xs text-on-surface-variant">{product.barcode || 'N/A'}</td>
                          <td className="px-8 py-5 font-mono text-sm font-bold text-on-surface">{formatCurrency(product.unit_price, { currencySymbol })}</td>
                        <td className="px-8 py-5">
                          <div className="flex items-center gap-3">
                            <div className="w-20 h-1.5 bg-surface-container rounded-full overflow-hidden">
                              <div
                                className={`h-full ${product.stock_value && product.stock_value < 20 ? 'bg-error' : 'bg-primary'}`}
                                style={{ width: `${Math.min((product.stock_value || 0), 100)}%` }}
                              />
                            </div>
                            <span className={`text-xs font-mono font-bold ${product.stock_value && product.stock_value < 20 ? 'text-error' : 'text-on-surface'}`}>
                              {product.stock_value || 0}
                            </span>
                          </div>
                        </td>
                        <td className="px-8 py-5 text-right text-on-surface-variant/30 group-hover:text-on-surface-variant transition-colors">
                          <div className="flex justify-end gap-1">
                            <Link to={`/inventory/product/${product.product_id}`} className="p-2 hover:bg-surface-container rounded-md">
                              <Eye size={16} />
                            </Link>
                            <button onClick={() => handleEditClick(product)} className="p-2 hover:bg-surface-container rounded-md">
                              <Edit2 size={16} />
                            </button>
                            <button onClick={() => handleDeleteClick(product.product_id)} className="p-2 hover:bg-error/5 hover:text-error rounded-md">
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </motion.div>
            ) : (
              <motion.div
                key="grid-view"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="p-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-8"
              >
                {paginatedProducts.map((product) => (
                  <Card key={product.product_id} hover className="overflow-hidden bg-surface-container-lowest">
                    <div className="aspect-square relative overflow-hidden bg-surface-container">
                      <img src={product.image_url || product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" referrerPolicy="no-referrer" />
                      <div className="bg-primary absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                        <Link
                          to={`/inventory/product/${product.product_id}`}
                          className="p-2.5 flex items-center justify-center bg-amber-950 backdrop-blur-sm text-on-surface rounded-lg shadow-lg hover:bg-primary hover:text-on-primary transition-all"
                        >
                          <Eye size={16} />
                        </Link>
                        <button
                          onClick={() => handleEditClick(product)}
                          className="p-2.5 flex items-center justify-center bg-surface-container-highest/90 backdrop-blur-sm text-on-surface rounded-lg shadow-lg hover:bg-primary hover:text-on-primary transition-all"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(product.product_id)}
                          className="p-2.5 bg-surface-container-highest/90 backdrop-blur-sm text-on-surface rounded-lg shadow-lg hover:bg-error hover:text-on-primary transition-all"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                      <div className="absolute bottom-4 left-4">
                        <Badge variant="secondary" className="backdrop-blur-sm bg-surface-container-highest/90">
                          {product.category?.name}
                        </Badge>
                      </div>
                    </div>
                    <div className="p-5 space-y-4 text-left">
                      <div>
                        <div className="flex justify-between items-start gap-2">
                          <h4 className="font-bold text-on-surface leading-tight truncate">{product.name}</h4>
                          <span className="font-mono font-bold text-primary text-sm">{formatCurrency(product.unit_price, { currencySymbol })}</span>
                        </div>
                        <p className="text-xs text-on-surface-variant font-medium mt-1 truncate">{product.brand} {product.model}</p>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
                          <span>Stock Level</span>
                          <span className={product.stock_value && product.stock_value < 20 ? 'text-error' : 'text-on-surface'}>{product.stock_value || 0} Units</span>
                        </div>
                        <div className="h-1.5 w-full bg-surface-container rounded-full overflow-hidden">
                          <div
                            className={`h-full transition-all duration-1000 ${product.stock_value && product.stock_value < 20 ? 'bg-error' : 'bg-primary'}`}
                            style={{ width: `${Math.min((product.stock_value || 0), 100)}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        )}

        <Pagination
          page={page}
          setPage={setPage}
          pageSize={pageSize}
          setPageSize={setPageSize}
          total={total}
        />
      </Card>

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          deleteProduct.reset();
        }}
        onConfirm={processDelete}
        title="Delete Product"
        message="Are you sure you want to delete this product? This action will permanently remove it from the inventory. This action cannot be undone."
        loading={deleteProduct.isPending}
        error={deleteProduct.error?.message}
      />
    </motion.div>
  );
}
