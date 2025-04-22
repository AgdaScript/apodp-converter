# APODP Converter

Aplicação local desenvolvida com **Next.js**, **TypeScript** e **ShadCN UI** para automatizar o processamento de arquivos Excel no formato **APODP**, com uma interface amigável baseada em drag and drop.

## ✅ Funcionalidades

- 🧲 **Upload com Drag & Drop**:
  - Interface inspirada em uploads modernos (como Google Drive), permitindo arrastar e soltar múltiplos arquivos `.xls` ou `.xlsx`.
  - Ou, se preferir, usar o botão "Browse" para selecionar manualmente.

- 📂 **Lista de arquivos carregados**:
  - Cada arquivo aparece em uma lista com nome, tipo e tamanho.
  - Exibe uma **barra de progresso individual** durante o processamento.
  - Possui botão de exclusão para remover arquivos da lista antes do processamento.
  
- 🔄 **Processamento automático após upload**:
  - Conversão dos campos `APNATR`, `APNSEQ`, `APNATG`, `APNSEQG` de texto para número.
  - Renomeia colunas:
    - `APNSEQ` → `APCONTA`
    - `APNSEQG` → `APCONTAG`

- ✅ **Download manual do resultado**:
  - Ao finalizar o processamento com sucesso, o botão de **download** aparece ao lado do arquivo.
  - Após o download, o arquivo **é removido da lista** automaticamente.
  
- ❌ **Exibição de erros** se houver falha no processamento ou arquivo inválido.

## ⚙️ Tecnologias

- **Next.js (App Router)**
- **TypeScript**
- **ShadCN UI** (com TailwindCSS)
- **xlsx** (para leitura e escrita dos arquivos Excel)
- **react-dropzone** (ou alternativa moderna) para o drag and drop

## 🧭 Fluxo do usuário

1. O usuário abre a aplicação local.
2. Arrasta 1 ou mais arquivos para a área de upload (ou navega para selecionar).
3. Os arquivos aparecem na lista com progresso de leitura/conversão.
4. Ao finalizar, aparece um botão de **"Download"**.
5. Ao clicar no download, o arquivo convertido é baixado e removido da lista.

## 🔒 Observações

> O aplicativo roda totalmente no navegador, sem envio de arquivos para servidores externos. Todo o processamento é feito localmente.

---

