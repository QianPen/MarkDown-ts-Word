import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Paper, Select, MenuItem, FormControl, InputLabel, Checkbox, FormControlLabel, Grid } from '@mui/material';
import ReactMarkdown from 'react-markdown';
import { marked } from 'marked';

const FONT_OPTIONS = [
  { label: 'Arial', value: 'Arial, sans-serif' },
  { label: 'Times New Roman', value: '"Times New Roman", serif' },
  { label: '微软雅黑', value: '"Microsoft YaHei", "微软雅黑", sans-serif' },
  { label: '宋体', value: 'SimSun, "宋体", serif' },
];
const FONT_SIZE_OPTIONS = [10, 12, 14, 16, 18, 20, 24, 28, 32];

const DEFAULT_STYLE = {
  fontFamily: FONT_OPTIONS[0].value,
  fontSize: 16,
  bold: false,
};

const DEFAULT_STYLES = {
  h1: { fontFamily: FONT_OPTIONS[0].value, fontSize: 28, bold: true },
  h2: { fontFamily: FONT_OPTIONS[0].value, fontSize: 22, bold: true },
  h3: { fontFamily: FONT_OPTIONS[0].value, fontSize: 18, bold: true },
  p:  { fontFamily: FONT_OPTIONS[0].value, fontSize: 16, bold: false },
};

type StyleKey = keyof typeof DEFAULT_STYLES;

type StyleConfig = {
  fontFamily: string;
  fontSize: number;
  bold: boolean;
};

export const MarkdownConverter: React.FC = () => {
  const [markdownInput, setMarkdownInput] = useState('');
  const [styles, setStyles] = useState<{ [k in StyleKey]: StyleConfig }>({ ...DEFAULT_STYLES });

  const handleStyleChange = (key: StyleKey, field: keyof StyleConfig, value: any) => {
    setStyles((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        [field]: value,
      },
    }));
  };

  const handleReset = () => {
    setStyles({ ...DEFAULT_STYLES });
  };

  // 复制为Word格式
  const handleCopyToWord = async () => {
    // 1. 生成HTML
    const html = marked.parse(markdownInput) as string;
    // 2. 用DOMParser解析
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    // 3. 遍历节点，设置style
    (['h1', 'h2', 'h3', 'p'] as StyleKey[]).forEach((tag) => {
      doc.querySelectorAll(tag).forEach((el) => {
        const style = styles[tag];
        el.setAttribute('style', `font-family: ${style.fontFamily}; font-size: ${style.fontSize}pt; font-weight: ${style.bold ? 'bold' : 'normal'}; margin: 0 0 8px 0;`);
      });
    });
    // li 标签用正文样式
    doc.querySelectorAll('li').forEach((el) => {
      const style = styles.p;
      el.setAttribute('style', `font-family: ${style.fontFamily}; font-size: ${style.fontSize}pt; font-weight: ${style.bold ? 'bold' : 'normal'}; margin: 0 0 8px 0;`);
    });
    // 4. 复制为HTML
    const htmlString = doc.body.innerHTML;
    await navigator.clipboard.write([
      new window.ClipboardItem({
        'text/html': new Blob([htmlString], { type: 'text/html' }),
        'text/plain': new Blob([doc.body.textContent || ''], { type: 'text/plain' }),
      })
    ]);
    alert('已复制为Word格式，可直接粘贴到Word！');
  };

  // 处理粘贴事件，始终以纯文本粘贴
  const handlePaste = (event: React.ClipboardEvent) => {
    event.preventDefault();
    const text = event.clipboardData.getData('text/plain');
    setMarkdownInput(text);
  };

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(180deg, #ffffff 0%, #f5f5f7 100%)', padding: { xs: 2, md: 4 } }}>
      <Box sx={{ maxWidth: 1200, margin: '0 auto', padding: { xs: 2, md: 4 }, background: 'rgba(255, 255, 255, 0.8)', backdropFilter: 'blur(20px)', borderRadius: '20px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
        <Typography variant="h3" sx={{ fontWeight: 600, textAlign: 'center', marginBottom: 4, background: 'linear-gradient(90deg, #1d1d1f 0%, #434344 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontSize: { xs: '2rem', md: '2.5rem' } }}>Markdown 转 Word 格式转换器</Typography>
        <Paper sx={{ padding: 3, borderRadius: '12px', background: 'rgba(255,255,255,0.95)', marginBottom: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 500, marginBottom: 2 }}>样式设置</Typography>
          <Grid container spacing={2}>
            {(['h1', 'h2', 'h3', 'p'] as StyleKey[]).map((key) => (
              <Grid item xs={12} md={3} key={key}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, marginBottom: 1 }}>
                  {key === 'h1' ? '一级标题' : key === 'h2' ? '二级标题' : key === 'h3' ? '三级标题' : '正文'}
                </Typography>
                <FormControl fullWidth sx={{ marginBottom: 1 }}>
                  <InputLabel>字体</InputLabel>
                  <Select
                    value={styles[key].fontFamily}
                    label="字体"
                    onChange={e => handleStyleChange(key, 'fontFamily', e.target.value)}
                  >
                    {FONT_OPTIONS.map(opt => (
                      <MenuItem value={opt.value} key={opt.value}>{opt.label}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl fullWidth sx={{ marginBottom: 1 }}>
                  <InputLabel>字号</InputLabel>
                  <Select
                    value={styles[key].fontSize}
                    label="字号"
                    onChange={e => handleStyleChange(key, 'fontSize', Number(e.target.value))}
                  >
                    {FONT_SIZE_OPTIONS.map(size => (
                      <MenuItem value={size} key={size}>{size}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControlLabel
                  control={<Checkbox checked={styles[key].bold} onChange={e => handleStyleChange(key, 'bold', e.target.checked)} />}
                  label="加粗"
                />
              </Grid>
            ))}
          </Grid>
          <Button variant="outlined" sx={{ mt: 2 }} onClick={handleReset}>恢复默认</Button>
        </Paper>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 4, marginBottom: 4 }}>
          <TextField
            fullWidth
            multiline
            rows={10}
            variant="outlined"
            label="输入 Markdown 文本"
            value={markdownInput}
            onChange={e => setMarkdownInput(e.target.value)}
            onPaste={handlePaste}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '12px',
                '& fieldset': { borderColor: '#d2d2d7' },
                '&:hover fieldset': { borderColor: '#86868b' },
                '&.Mui-focused fieldset': { borderColor: '#0071e3' }
              }
            }}
          />
          <Box>
            <Typography variant="h6" sx={{ marginBottom: 2, color: '#1d1d1f', fontWeight: 500 }}>预览</Typography>
            <Paper sx={{ padding: 3, minHeight: 200, borderRadius: '12px', background: 'rgba(255, 255, 255, 0.9)', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)' }}>
              <ReactMarkdown>{markdownInput}</ReactMarkdown>
            </Paper>
          </Box>
        </Box>
        <Button
          variant="contained"
          onClick={handleCopyToWord}
          fullWidth
          sx={{ background: '#0071e3', borderRadius: '12px', padding: '12px', fontSize: '1.1rem', textTransform: 'none', '&:hover': { background: '#0077ed' } }}
        >
          复制为 Word 格式
        </Button>
      </Box>
    </Box>
  );
};