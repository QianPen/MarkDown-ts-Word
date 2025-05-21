import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Paper, Select, MenuItem, FormControl, InputLabel, Checkbox, FormControlLabel, Grid, Accordion, AccordionSummary, AccordionDetails, useTheme } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ReactMarkdown from 'react-markdown';
import { marked } from 'marked';

const FONT_OPTIONS = [
  { label: 'Arial', value: 'Arial, sans-serif' },
  { label: 'Times New Roman', value: '"Times New Roman", serif' },
  { label: '微软雅黑', value: '"Microsoft YaHei", "微软雅黑", sans-serif' },
  { label: '宋体', value: 'SimSun, "宋体", serif' },
  { label: '黑体', value: 'SimHei, "黑体", sans-serif' },
];
// 字号选项，含小三(15pt)、小四(12pt)、小五(10.5pt)
const FONT_SIZE_OPTIONS = [
  { label: '10', value: 10 },
  { label: '小五(10.5)', value: 10.5 },
  { label: '小四(12)', value: 12 },
  { label: '14', value: 14 },
  { label: '小三(15)', value: 15 },
  { label: '16', value: 16 },
  { label: '18', value: 18 },
  { label: '20', value: 20 },
  { label: '24', value: 24 },
  { label: '28', value: 28 },
  { label: '32', value: 32 },
];

const DEFAULT_STYLE = {
  fontFamily: FONT_OPTIONS[0].value,
  fontSize: 16,
  bold: false,
};

const DEFAULT_STYLES = {
  h1: { fontFamily: FONT_OPTIONS[0].value, fontSize: 28, bold: true, marginTop: 16, marginBottom: 16 },
  h2: { fontFamily: FONT_OPTIONS[0].value, fontSize: 22, bold: true, marginTop: 12, marginBottom: 12 },
  h3: { fontFamily: FONT_OPTIONS[0].value, fontSize: 18, bold: true, marginTop: 8, marginBottom: 8 },
  p:  { fontFamily: FONT_OPTIONS[0].value, fontSize: 16, bold: false, marginTop: 4, marginBottom: 4 },
};

type StyleKey = keyof typeof DEFAULT_STYLES;

type StyleConfig = {
  fontFamily: string;
  fontSize: number;
  bold: boolean;
  marginTop: number;
  marginBottom: number;
};

const STYLE_LABELS: Record<StyleKey, string> = {
  h1: '一级标题',
  h2: '二级标题',
  h3: '三级标题',
  p: '正文',
};

export const MarkdownConverter: React.FC = () => {
  const [markdownInput, setMarkdownInput] = useState('');
  const [styles, setStyles] = useState<{ [k in StyleKey]: StyleConfig }>({ ...DEFAULT_STYLES });
  const [expanded, setExpanded] = useState<StyleKey | false>('h1');
  const theme = useTheme();

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
        el.setAttribute('style', `font-family: ${style.fontFamily}; font-size: ${style.fontSize}pt; font-weight: ${style.bold ? 'bold' : 'normal'}; margin-top: ${style.marginTop}pt; margin-bottom: ${style.marginBottom}pt;`);
      });
    });
    // li 标签用正文样式
    doc.querySelectorAll('li').forEach((el) => {
      const style = styles.p;
      el.setAttribute('style', `font-family: ${style.fontFamily}; font-size: ${style.fontSize}pt; font-weight: ${style.bold ? 'bold' : 'normal'}; margin-top: ${style.marginTop}pt; margin-bottom: ${style.marginBottom}pt;`);
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
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)', padding: { xs: 2, md: 4 } }}>
      <Box sx={{ maxWidth: 1200, margin: '0 auto', padding: { xs: 2, md: 4 }, background: 'rgba(255, 255, 255, 0.85)', backdropFilter: 'blur(24px)', borderRadius: '28px', boxShadow: '0 8px 32px 0 rgba(31,38,135,0.18)' }}>
        <Typography variant="h2" sx={{ fontWeight: 800, textAlign: 'center', mb: 4, letterSpacing: 2, background: 'linear-gradient(90deg, #0071e3 0%, #434344 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontSize: { xs: '2.2rem', md: '3rem' }, textShadow: '0 2px 8px rgba(0,113,227,0.08)' }}>
          Markdown 转 Word 格式转换器
        </Typography>
        <Paper sx={{ p: 3, borderRadius: '18px', background: 'linear-gradient(120deg, #f8fafc 60%, #e3e9f0 100%)', mb: 3, boxShadow: '0 2px 12px 0 rgba(0,113,227,0.08)' }}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: '#0071e3' }}>样式设置</Typography>
          {(['h1', 'h2', 'h3', 'p'] as StyleKey[]).map((key) => (
            <Accordion
              key={key}
              expanded={expanded === key}
              onChange={(_, isExp) => setExpanded(isExp ? key : false)}
              sx={{
                mb: 2,
                borderRadius: '14px',
                boxShadow: expanded === key ? '0 4px 16px 0 rgba(0,113,227,0.10)' : '0 1px 4px 0 rgba(0,0,0,0.04)',
                background: expanded === key
                  ? 'linear-gradient(90deg, #e3f0ff 0%, #f8fafc 100%)'
                  : 'linear-gradient(90deg, #f8fafc 0%, #e3e9f0 100%)',
                transition: 'box-shadow 0.3s, background 0.3s',
                '&:before': { display: 'none' },
              }}
            >
              <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: '#0071e3' }} />}>
                <Typography sx={{ fontWeight: 700, color: '#0071e3', fontSize: '1.1rem' }}>{STYLE_LABELS[key]}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <FormControl fullWidth sx={{ mb: 1 }}>
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
                  </Grid>
                  <Grid item xs={6}>
                    <FormControl fullWidth sx={{ mb: 1 }}>
                      <InputLabel>字号</InputLabel>
                      <Select
                        value={styles[key].fontSize}
                        label="字号"
                        onChange={e => handleStyleChange(key, 'fontSize', Number(e.target.value))}
                      >
                        {FONT_SIZE_OPTIONS.map(size => (
                          <MenuItem value={size.value} key={size.value}>{size.label}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={6}>
                    <FormControlLabel
                      control={<Checkbox checked={styles[key].bold} onChange={e => handleStyleChange(key, 'bold', e.target.checked)} />}
                      label="加粗"
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      label="段前间距 (pt)"
                      type="number"
                      size="small"
                      value={styles[key].marginTop}
                      onChange={e => handleStyleChange(key, 'marginTop', Number(e.target.value))}
                      inputProps={{ min: 0 }}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      label="段后间距 (pt)"
                      type="number"
                      size="small"
                      value={styles[key].marginBottom}
                      onChange={e => handleStyleChange(key, 'marginBottom', Number(e.target.value))}
                      inputProps={{ min: 0 }}
                      fullWidth
                    />
                  </Grid>
                </Grid>
              </AccordionDetails>
            </Accordion>
          ))}
          <Button variant="outlined" sx={{ mt: 2, borderRadius: '8px', borderColor: '#0071e3', color: '#0071e3', fontWeight: 600, letterSpacing: 1, transition: 'all 0.2s', '&:hover': { background: '#e3f0ff', borderColor: '#0071e3' } }} onClick={handleReset}>恢复默认</Button>
        </Paper>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 4, mb: 4 }}>
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
              background: 'rgba(255,255,255,0.95)',
              borderRadius: '14px',
              boxShadow: '0 2px 8px 0 rgba(0,113,227,0.06)',
              '& .MuiOutlinedInput-root': {
                borderRadius: '12px',
                '& fieldset': { borderColor: '#d2d2d7' },
                '&:hover fieldset': { borderColor: '#86868b' },
                '&.Mui-focused fieldset': { borderColor: '#0071e3' }
              }
            }}
          />
          <Box>
            <Typography variant="h6" sx={{ mb: 2, color: '#0071e3', fontWeight: 700, letterSpacing: 1 }}>实时预览</Typography>
            <Paper sx={{ p: 3, minHeight: 200, borderRadius: '14px', background: 'rgba(255,255,255,0.98)', boxShadow: '0 2px 12px 0 rgba(0,113,227,0.08)', border: '1.5px solid #e3e9f0', transition: 'box-shadow 0.2s', '&:hover': { boxShadow: '0 4px 24px 0 rgba(0,113,227,0.13)' } }}>
              <ReactMarkdown>{markdownInput}</ReactMarkdown>
            </Paper>
          </Box>
        </Box>
        <Button
          variant="contained"
          onClick={handleCopyToWord}
          fullWidth
          sx={{
            background: 'linear-gradient(90deg, #0071e3 0%, #4f8cff 100%)',
            borderRadius: '14px',
            p: 1.5,
            fontSize: '1.2rem',
            fontWeight: 700,
            letterSpacing: 1,
            textTransform: 'none',
            boxShadow: '0 2px 12px 0 rgba(0,113,227,0.10)',
            transition: 'all 0.2s',
            '&:hover': {
              background: 'linear-gradient(90deg, #005bbd 0%, #0071e3 100%)',
              boxShadow: '0 4px 24px 0 rgba(0,113,227,0.18)',
            }
          }}
        >
          复制为 Word 格式
        </Button>
      </Box>
    </Box>
  );
};