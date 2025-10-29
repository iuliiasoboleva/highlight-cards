import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { ChevronRight, Book, Search } from 'lucide-react';
import axiosInstance from '../../axiosInstance';
import LoaderCentered from '../../components/LoaderCentered';
import {
  Container,
  Sidebar,
  Content,
  CategoryTitle,
  ArticleLink,
  ArticleTitle,
  ArticleContent,
  SearchBox,
  SearchInput,
  EmptyState,
} from './styles';

const KnowledgeBase = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [articles, setArticles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [currentArticle, setCurrentArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadArticles();
    loadCategories();
  }, []);

  useEffect(() => {
    if (slug) {
      loadArticle(slug);
    } else if (articles.length > 0) {
      navigate(`/education/${articles[0].slug}`);
    }
  }, [slug, articles]);

  const loadArticles = async () => {
    try {
      const res = await axiosInstance.get('/faq/articles');
      console.log('Статьи загружены:', res.data);
      setArticles(res.data);
    } catch (error) {
      console.error('Ошибка загрузки статей:', error);
      console.error('Детали:', error.response || error.message);
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const res = await axiosInstance.get('/faq/categories');
      console.log('Категории загружены:', res.data);
      setCategories(res.data);
    } catch (error) {
      console.error('Ошибка загрузки категорий:', error);
    }
  };

  const loadArticle = async (articleSlug) => {
    try {
      const res = await axiosInstance.get(`/faq/articles/${articleSlug}`);
      console.log('Статья загружена:', res.data);
      setCurrentArticle(res.data);
    } catch (error) {
      console.error('Ошибка загрузки статьи:', error);
    }
  };

  const groupedArticles = categories.reduce((acc, category) => {
    acc[category] = articles.filter((a) => a.category === category);
    return acc;
  }, {});

  const filteredArticles = searchQuery
    ? articles.filter((a) =>
        a.title.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : articles;

  if (loading) return <LoaderCentered />;

  return (
    <Container>
      <Sidebar>
        <div style={{ padding: '20px', borderBottom: '1px solid #e5e7eb' }}>
          <h2 style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
            <Book size={24} />
            База знаний
          </h2>
        </div>

        <SearchBox>
          <Search size={16} />
          <SearchInput
            type="text"
            placeholder="Поиск..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </SearchBox>

        {searchQuery ? (
          <div style={{ padding: '0 20px' }}>
            {filteredArticles.length === 0 ? (
              <EmptyState>Ничего не найдено</EmptyState>
            ) : (
              filteredArticles.map((article) => (
                <ArticleLink
                  key={article.slug}
                  $active={slug === article.slug}
                  onClick={() => navigate(`/education/${article.slug}`)}
                >
                  <span>{article.title}</span>
                  <ChevronRight size={16} />
                </ArticleLink>
              ))
            )}
          </div>
        ) : (
          Object.keys(groupedArticles).map((category) => (
            <div key={category} style={{ marginBottom: '24px' }}>
              <CategoryTitle>{category}</CategoryTitle>
              {groupedArticles[category].map((article) => (
                <ArticleLink
                  key={article.slug}
                  $active={slug === article.slug}
                  onClick={() => navigate(`/education/${article.slug}`)}
                >
                  <span>{article.title}</span>
                  <ChevronRight size={16} />
                </ArticleLink>
              ))}
            </div>
          ))
        )}
      </Sidebar>

      <Content>
        {currentArticle ? (
          <>
            <ArticleTitle>{currentArticle.title}</ArticleTitle>
            <ArticleContent>
              <ReactMarkdown>{currentArticle.content}</ReactMarkdown>
            </ArticleContent>
          </>
        ) : (
          <EmptyState>Выберите статью из списка</EmptyState>
        )}
      </Content>
    </Container>
  );
};

export default KnowledgeBase;

