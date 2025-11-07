import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import styled from 'styled-components';

import adminAxiosInstance from '../../adminAxiosInstance';

const Container = styled.div`
  min-height: 100vh;
  background: #f5f5f7;
`;

const Header = styled.header`
  background: white;
  border-bottom: 1px solid #e0e0e0;
  padding: 16px 32px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Logo = styled.h1`
  font-size: 24px;
  font-weight: 700;
  color: #667eea;
  margin: 0;
  cursor: pointer;
`;

const Content = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 32px;
`;

const Title = styled.h2`
  font-size: 32px;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Button = styled.button`
  padding: 10px 20px;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  font-size: 14px;

  &:hover {
    background: #5568d3;
  }
`;

const ArticlesList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const ArticleCard = styled.div`
  background: white;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  display: flex;
  justify-content: space-between;
  align-items: start;
`;

const ArticleInfo = styled.div`
  flex: 1;
`;

const ArticleTitle = styled.h3`
  font-size: 18px;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0 0 8px 0;
`;

const ArticleMeta = styled.div`
  display: flex;
  gap: 16px;
  font-size: 14px;
  color: #666;
  margin-bottom: 8px;
`;

const ArticleContent = styled.p`
  font-size: 14px;
  color: #333;
  margin: 0;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const ArticleActions = styled.div`
  display: flex;
  gap: 8px;
`;

const IconButton = styled.button`
  padding: 8px 12px;
  background: ${(props) => (props.$danger ? '#fee2e2' : '#f3f4f6')};
  color: ${(props) => (props.$danger ? '#991b1b' : '#333')};
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;

  &:hover {
    background: ${(props) => (props.$danger ? '#fecaca' : '#e5e7eb')};
  }
`;

const Badge = styled.span`
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  background: ${(props) => (props.$published ? '#d1fae5' : '#fee2e2')};
  color: ${(props) => (props.$published ? '#065f46' : '#991b1b')};
`;

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 12px;
  padding: 32px;
  max-width: 800px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
`;

const ModalTitle = styled.h3`
  font-size: 24px;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0 0 24px 0;
`;

const FormGroup = styled.div`
  margin-bottom: 20px;
`;

const Label = styled.label`
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px 14px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 14px;

  &:focus {
    outline: none;
    border-color: #667eea;
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 10px 14px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 14px;
  min-height: 200px;
  font-family: inherit;

  &:focus {
    outline: none;
    border-color: #667eea;
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 10px 14px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 14px;
  background: white;

  &:focus {
    outline: none;
    border-color: #667eea;
  }
`;

const ModalActions = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 24px;
`;

const Loading = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 400px;
  font-size: 18px;
  color: #666;
`;

const Tabs = styled.div`
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
  border-bottom: 2px solid #e0e0e0;
`;

const Tab = styled.button`
  padding: 12px 24px;
  background: none;
  border: none;
  font-size: 16px;
  font-weight: 600;
  color: ${(props) => (props.$active ? '#667eea' : '#666')};
  border-bottom: 2px solid ${(props) => (props.$active ? '#667eea' : 'transparent')};
  margin-bottom: -2px;
  cursor: pointer;

  &:hover {
    color: #667eea;
  }
`;

const AdminFAQ = () => {
  const navigate = useNavigate();
  const [articles, setArticles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [editingArticle, setEditingArticle] = useState(null);
  const [editingCategory, setEditingCategory] = useState(null);
  const [activeTab, setActiveTab] = useState('articles');
  const [formData, setFormData] = useState({
    slug: '',
    title: '',
    content: '',
    category_id: null,
    order_index: 0,
    is_published: true,
  });
  const [categoryFormData, setCategoryFormData] = useState({
    name: '',
    description: '',
    order_index: 0,
    is_active: true,
  });

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin/login');
      return;
    }

    fetchArticles();
    fetchCategories();
  }, [navigate]);

  const fetchArticles = async () => {
    try {
      setLoading(true);
      const response = await adminAxiosInstance.get('/admin/faq/articles');
      setArticles(response.data);
    } catch (error) {
      if (error.response?.status === 401) {
        navigate('/admin/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await adminAxiosInstance.get('/admin/faq/categories');
      setCategories(response.data);
    } catch (error) {
      console.error('Ошибка загрузки категорий:', error);
    }
  };

  const handleCreate = () => {
    setEditingArticle(null);
    setFormData({
      slug: '',
      title: '',
      content: '',
      category_id: null,
      order_index: 0,
      is_published: true,
    });
    setShowModal(true);
  };

  const handleEdit = (article) => {
    setEditingArticle(article);
    setFormData({
      slug: article.slug,
      title: article.title,
      content: article.content,
      category_id: article.category_id || null,
      order_index: article.order_index,
      is_published: article.is_published,
    });
    setShowModal(true);
  };

  const handleCreateCategory = () => {
    setEditingCategory(null);
    setCategoryFormData({
      name: '',
      description: '',
      order_index: 0,
      is_active: true,
    });
    setShowCategoryModal(true);
  };

  const handleEditCategory = (category) => {
    setEditingCategory(category);
    setCategoryFormData({
      name: category.name,
      description: category.description || '',
      order_index: category.order_index,
      is_active: category.is_active,
    });
    setShowCategoryModal(true);
  };

  const handleDelete = async (articleId) => {
    if (!window.confirm('Вы уверены, что хотите удалить эту статью?')) {
      return;
    }

    try {
      await adminAxiosInstance.delete(`/admin/faq/articles/${articleId}`);
      fetchArticles();
    } catch (error) {
      alert('Ошибка при удалении статьи');
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    if (!window.confirm('Вы уверены, что хотите удалить эту категорию?')) {
      return;
    }

    try {
      await adminAxiosInstance.delete(`/admin/faq/categories/${categoryId}`);
      fetchCategories();
      fetchArticles();
    } catch (error) {
      alert(error.response?.data?.detail || 'Ошибка при удалении категории');
    }
  };

  const handleSave = async () => {
    try {
      if (editingArticle) {
        await adminAxiosInstance.put(`/admin/faq/articles/${editingArticle.id}`, formData);
      } else {
        await adminAxiosInstance.post('/admin/faq/articles', formData);
      }
      setShowModal(false);
      fetchArticles();
    } catch (error) {
      alert(error.response?.data?.detail || 'Ошибка при сохранении статьи');
    }
  };

  const handleSaveCategory = async () => {
    try {
      if (editingCategory) {
        await adminAxiosInstance.put(`/admin/faq/categories/${editingCategory.id}`, categoryFormData);
      } else {
        await adminAxiosInstance.post('/admin/faq/categories', categoryFormData);
      }
      setShowCategoryModal(false);
      fetchCategories();
      fetchArticles();
    } catch (error) {
      alert(error.response?.data?.detail || 'Ошибка при сохранении категории');
    }
  };

  if (loading) {
    return (
      <Container>
        <Header>
          <Logo onClick={() => navigate('/admin/dashboard')}>← Loyal Club Admin</Logo>
        </Header>
        <Loading>Загрузка...</Loading>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <Logo onClick={() => navigate('/admin/dashboard')}>← Loyal Club Admin</Logo>
      </Header>

      <Content>
        <Title>
          <span>База знаний (FAQ)</span>
        </Title>

        <Tabs>
          <Tab $active={activeTab === 'articles'} onClick={() => setActiveTab('articles')}>
            Статьи
          </Tab>
          <Tab $active={activeTab === 'categories'} onClick={() => setActiveTab('categories')}>
            Категории
          </Tab>
        </Tabs>

        {activeTab === 'articles' && (
          <>
            <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'flex-end' }}>
              <Button onClick={handleCreate}>+ Создать статью</Button>
            </div>

            <ArticlesList>
              {articles.map((article) => (
                <ArticleCard key={article.id}>
                  <ArticleInfo>
                    <ArticleTitle>{article.title}</ArticleTitle>
                    <ArticleMeta>
                      <span>Slug: {article.slug}</span>
                      {article.category_name && <span>Категория: {article.category_name}</span>}
                      <span>Порядок: {article.order_index}</span>
                      <Badge $published={article.is_published}>
                        {article.is_published ? 'Опубликовано' : 'Черновик'}
                      </Badge>
                    </ArticleMeta>
                    <ArticleContent>{article.content.substring(0, 200)}...</ArticleContent>
                  </ArticleInfo>
                  <ArticleActions>
                    <IconButton onClick={() => handleEdit(article)}>Редактировать</IconButton>
                    <IconButton $danger onClick={() => handleDelete(article.id)}>
                      Удалить
                    </IconButton>
                  </ArticleActions>
                </ArticleCard>
              ))}
              {articles.length === 0 && (
                <ArticleCard>
                  <ArticleInfo>
                    <ArticleTitle>Статей пока нет</ArticleTitle>
                    <ArticleContent>Создайте первую статью базы знаний</ArticleContent>
                  </ArticleInfo>
                </ArticleCard>
              )}
            </ArticlesList>
          </>
        )}

        {activeTab === 'categories' && (
          <>
            <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'flex-end' }}>
              <Button onClick={handleCreateCategory}>+ Создать категорию</Button>
            </div>

            <ArticlesList>
              {categories.map((category) => (
                <ArticleCard key={category.id}>
                  <ArticleInfo>
                    <ArticleTitle>{category.name}</ArticleTitle>
                    <ArticleMeta>
                      <span>Порядок: {category.order_index}</span>
                      <Badge $published={category.is_active}>
                        {category.is_active ? 'Активна' : 'Неактивна'}
                      </Badge>
                    </ArticleMeta>
                    {category.description && (
                      <ArticleContent>{category.description}</ArticleContent>
                    )}
                  </ArticleInfo>
                  <ArticleActions>
                    <IconButton onClick={() => handleEditCategory(category)}>
                      Редактировать
                    </IconButton>
                    <IconButton $danger onClick={() => handleDeleteCategory(category.id)}>
                      Удалить
                    </IconButton>
                  </ArticleActions>
                </ArticleCard>
              ))}
              {categories.length === 0 && (
                <ArticleCard>
                  <ArticleInfo>
                    <ArticleTitle>Категорий пока нет</ArticleTitle>
                    <ArticleContent>Создайте первую категорию</ArticleContent>
                  </ArticleInfo>
                </ArticleCard>
              )}
            </ArticlesList>
          </>
        )}

        {showModal && (
          <Modal onClick={() => setShowModal(false)}>
            <ModalContent onClick={(e) => e.stopPropagation()}>
              <ModalTitle>
                {editingArticle ? 'Редактировать статью' : 'Создать статью'}
              </ModalTitle>

              <FormGroup>
                <Label>Slug (URL-адрес)</Label>
                <Input
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  placeholder="nazvanie-stati"
                />
              </FormGroup>

              <FormGroup>
                <Label>Заголовок</Label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Название статьи"
                />
              </FormGroup>

              <FormGroup>
                <Label>Содержание (Markdown)</Label>
                <TextArea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="# Заголовок&#10;&#10;Текст статьи..."
                />
              </FormGroup>

              <FormGroup>
                <Label>Категория</Label>
                <Select
                  value={formData.category_id || ''}
                  onChange={(e) => setFormData({ ...formData, category_id: e.target.value ? parseInt(e.target.value) : null })}
                >
                  <option value="">Без категории</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </Select>
              </FormGroup>

              <FormGroup>
                <Label>Порядок сортировки</Label>
                <Input
                  type="number"
                  value={formData.order_index}
                  onChange={(e) =>
                    setFormData({ ...formData, order_index: parseInt(e.target.value) || 0 })
                  }
                />
              </FormGroup>

              <FormGroup>
                <Label>
                  <input
                    type="checkbox"
                    checked={formData.is_published}
                    onChange={(e) =>
                      setFormData({ ...formData, is_published: e.target.checked })
                    }
                  />
                  {' '}
                  Опубликовано
                </Label>
              </FormGroup>

              <ModalActions>
                <IconButton onClick={() => setShowModal(false)}>Отмена</IconButton>
                <Button onClick={handleSave}>Сохранить</Button>
              </ModalActions>
            </ModalContent>
          </Modal>
        )}

        {showCategoryModal && (
          <Modal onClick={() => setShowCategoryModal(false)}>
            <ModalContent onClick={(e) => e.stopPropagation()}>
              <ModalTitle>
                {editingCategory ? 'Редактировать категорию' : 'Создать категорию'}
              </ModalTitle>

              <FormGroup>
                <Label>Название</Label>
                <Input
                  value={categoryFormData.name}
                  onChange={(e) => setCategoryFormData({ ...categoryFormData, name: e.target.value })}
                  placeholder="Название категории"
                />
              </FormGroup>

              <FormGroup>
                <Label>Описание (необязательно)</Label>
                <TextArea
                  value={categoryFormData.description}
                  onChange={(e) => setCategoryFormData({ ...categoryFormData, description: e.target.value })}
                  placeholder="Описание категории..."
                  style={{ minHeight: '100px' }}
                />
              </FormGroup>

              <FormGroup>
                <Label>Порядок сортировки</Label>
                <Input
                  type="number"
                  value={categoryFormData.order_index}
                  onChange={(e) =>
                    setCategoryFormData({ ...categoryFormData, order_index: parseInt(e.target.value) || 0 })
                  }
                />
              </FormGroup>

              <FormGroup>
                <Label>
                  <input
                    type="checkbox"
                    checked={categoryFormData.is_active}
                    onChange={(e) =>
                      setCategoryFormData({ ...categoryFormData, is_active: e.target.checked })
                    }
                  />
                  {' '}
                  Активна
                </Label>
              </FormGroup>

              <ModalActions>
                <IconButton onClick={() => setShowCategoryModal(false)}>Отмена</IconButton>
                <Button onClick={handleSaveCategory}>Сохранить</Button>
              </ModalActions>
            </ModalContent>
          </Modal>
        )}
      </Content>
    </Container>
  );
};

export default AdminFAQ;

