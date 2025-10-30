import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  height: calc(100vh - 60px);
  background: #f9fafb;

  @media (max-width: 768px) {
    flex-direction: column;
    height: auto;
    min-height: calc(100vh - 60px);
  }
`;

export const Sidebar = styled.div`
  width: 320px;
  background: white;
  border-right: 1px solid #e5e7eb;
  overflow-y: auto;
  flex-shrink: 0;

  @media (max-width: 768px) {
    width: 100%;
    border-right: none;
    border-bottom: 1px solid #e5e7eb;
    max-height: 50vh;
  }
`;

export const SearchBox = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 16px 20px;
  border-bottom: 1px solid #e5e7eb;
  color: #6b7280;
`;

export const SearchInput = styled.input`
  flex: 1;
  border: none;
  outline: none;
  font-size: 14px;

  &::placeholder {
    color: #9ca3af;
  }
`;

export const CategoryTitle = styled.div`
  padding: 12px 20px 8px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  color: #6b7280;
  letter-spacing: 0.05em;
`;

export const ArticleLink = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 20px;
  cursor: pointer;
  transition: all 0.2s;
  color: ${(props) => (props.$active ? '#ef4444' : '#374151')};
  background: ${(props) => (props.$active ? '#fef2f2' : 'transparent')};
  border-left: 3px solid ${(props) => (props.$active ? '#ef4444' : 'transparent')};
  font-size: 14px;

  &:hover {
    background: #f9fafb;
  }

  svg {
    opacity: ${(props) => (props.$active ? 1 : 0)};
    transition: opacity 0.2s;
  }

  &:hover svg {
    opacity: 1;
  }
`;

export const Content = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 40px 60px;
  background: white;
  margin: 20px;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);

  @media (max-width: 768px) {
    margin: 0;
    padding: 20px;
    border-radius: 0;
    min-height: 50vh;
  }
`;

export const ArticleTitle = styled.h1`
  font-size: 32px;
  font-weight: 700;
  margin: 0 0 24px;
  color: #111827;

  @media (max-width: 768px) {
    font-size: 24px;
  }
`;

export const ArticleContent = styled.div`
  font-size: 16px;
  line-height: 1.7;
  color: #374151;

  @media (max-width: 768px) {
    font-size: 15px;
  }

  h1 {
    font-size: 28px;
    font-weight: 700;
    margin: 32px 0 16px;
    color: #111827;

    @media (max-width: 768px) {
      font-size: 22px;
      margin: 24px 0 12px;
    }
  }

  h2 {
    font-size: 24px;
    font-weight: 600;
    margin: 28px 0 14px;
    color: #111827;

    @media (max-width: 768px) {
      font-size: 20px;
      margin: 20px 0 10px;
    }
  }

  h3 {
    font-size: 20px;
    font-weight: 600;
    margin: 24px 0 12px;
    color: #111827;

    @media (max-width: 768px) {
      font-size: 18px;
      margin: 18px 0 10px;
    }
  }

  p {
    margin: 16px 0;
  }

  ul,
  ol {
    margin: 16px 0;
    padding-left: 24px;
  }

  li {
    margin: 8px 0;
  }

  code {
    background: #f3f4f6;
    padding: 2px 6px;
    border-radius: 4px;
    font-family: 'Monaco', 'Courier New', monospace;
    font-size: 14px;
  }

  pre {
    background: #1f2937;
    color: #f9fafb;
    padding: 16px;
    border-radius: 8px;
    overflow-x: auto;

    code {
      background: transparent;
      color: inherit;
      padding: 0;
    }
  }

  blockquote {
    border-left: 4px solid #ef4444;
    padding-left: 16px;
    margin: 16px 0;
    color: #6b7280;
    font-style: italic;
  }

  a {
    color: #ef4444;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }

  img {
    max-width: 100%;
    border-radius: 8px;
    margin: 16px 0;
  }

  hr {
    border: none;
    border-top: 1px solid #e5e7eb;
    margin: 32px 0;
  }
`;

export const EmptyState = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  color: #9ca3af;
  font-size: 16px;
`;
