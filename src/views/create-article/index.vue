<template>
  <div class="page-view">
    <el-card class="the-card">
      <el-page-header @back="handleBack" content="详情页面">
        <div class="content" slot="content">
          <div class="title">
            写文章
          </div>
          <div class="control">
            <el-button size="small" @click="handleSave(true)">保存草稿</el-button>
            <el-button type="primary" class="the-button" size="small" @click="drawer=true">发布设置</el-button>
          </div>
        </div>
      </el-page-header>
      <quill-editor
        class="editor"
        ref="myQuillEditor"
        v-model="article.content"
        :options="editorOption"
        @change="autoSaveDebounce"
      />
      <span class="auto-save">
        <template v-if="isAutoSaving">
          <i class="icon el-icon-loading"></i>
          <span class="tip">正在保存</span>
        </template>
        <template v-else>
          <i class="icon el-icon-circle-check"></i>
          <span class="tip">已保存，上次保存时间{{ updatedAt | dayjs }}</span>
        </template>
      </span>
    </el-card>
    <el-drawer
      title="我是标题"
      size="400px"
      class="the-drawer"
      :visible.sync="drawer">
      <div class="content">
        <el-form size="small" :model="article" label-width="55px" label-position="right">
          <el-form-item label="文章名">
            <el-input v-model="article.title"></el-input>
          </el-form-item>
          <el-form-item label="分类">
            <el-input v-model="article.category"></el-input>
          </el-form-item>
          <el-form-item label="标签">
            <el-select
              style="width: 100%"
              v-model="article.tags"
              multiple
              filterable
              allow-create
              default-first-option
              placeholder="请选择文章标签">
              <el-option
                v-for="item in tags"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="描述">
            <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 10}" v-model="article.description"></el-input>
          </el-form-item>
          <el-form-item label="私有">
            <el-switch
              v-model="article.private">
            </el-switch>
          </el-form-item>
          <el-form-item label="">
            <el-button type="primary" size="small" @click="handleSave(false)">立即发布</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-drawer>
  </div>
</template>
<script>
import Prism from 'prismjs';
import { quillEditor } from 'vue-quill-editor';
import 'quill/dist/quill.core.css';
import 'quill/dist/quill.snow.css';
import 'quill/dist/quill.bubble.css';
import 'prismjs/themes/prism-okaidia.css';
import 'prismjs/plugins/custom-class/prism-custom-class';

Prism.plugins.customClass.add(({ content, type, language }) => {
  return `hljs-${language}`;
});
const toolbarOptions = [
  [{ header: [1, 2, 3, 4, 5, 6, false] }], // 标题-----[{ header: [1, 2, 3, 4, 5, 6, false] }]
  ['bold', 'italic', 'underline', 'strike', 'link'], // 加粗 斜体 下划线 删除线 -----['bold', 'italic', 'underline', 'strike']
  ['blockquote', 'code-block'], // 引用  代码块-----['blockquote', 'code-block']
  [{ list: 'ordered' }, { list: 'bullet' }], // 有序、无序列表-----[{ list: 'ordered' }, { list: 'bullet' }]
  [{ script: 'sub' }, { script: 'super' }], // 上标/下标-----[{ script: 'sub' }, { script: 'super' }]
  [{ indent: '-1' }, { indent: '+1' }], // 缩进-----[{ indent: '-1' }, { indent: '+1' }]
  [{ size: ['small', false, 'large', 'huge'] }], // 字体大小-----[{ size: ['small', false, 'large', 'huge'] }]
  [{ color: [] }, { background: [] }], // 字体颜色、字体背景颜色-----[{ color: [] }, { background: [] }]
  [{ font: [] }], // 字体种类-----[{ font: [] }]
  [{ align: [] }], // 对齐方式-----[{ align: [] }]
  ['clean'], // 清除文本格式-----['clean']
  ['image'] // 链接、图片、视频-----['link', 'image', 'video']
];
export default {
  name: 'Login',
  data () {
    return {
      tags: [{
        value: 'HTML',
        label: 'HTML'
      }, {
        value: 'CSS',
        label: 'CSS'
      }, {
        value: 'JavaScript',
        label: 'JavaScript'
      }],
      drawer: false,
      article: {
        title: '',
        private: true,
        tags: [],
        content: '',
        category: '',
        description: ''
      },
      editorOption: {
        readOnly: true,
        placeholder: '请输入文本...',
        modules: {
          toolbar: {
            container: toolbarOptions,
            handlers: {}
          },
          syntax: {
            highlight: code => Prism.highlight(code, Prism.languages.javascript, 'javascript')
          }
        }
      },
      isAutoSaving: false,
      updatedAt: Date.now()
    };
  },
  computed: {
    isEditArticle () {
      return this.$route.path === '/edit-article';
    },
    articleId () {
      return this.$route.query.id;
    }
  },
  created () {
    this.autoSaveDebounce = _.debounce(this.autoSave, 3000);
  },
  mounted () {
    this.isEditArticle && this.fetchArticleDetail();
  },
  methods: {
    autoSave () {
      this.handleSave(true);
    },
    fetchArticleDetail () {
      const API = CONFIG.API.ARTICLE_DETAIL;
      const params = {
        id: this.articleId
      };
      $http.get(API, { params })
        .then(res => {
          this.article = res.data;
        });
    },
    handleBack () {
      this.$router.replace({
        name: 'Articles'
      });
    },
    handleSave (draft) {
      this.isAutoSaving = true;
      const API = CONFIG.API.SAVE_ARTICLE;
      const data = {
        id: this.articleId,
        ...this.article,
        draft
      };
      $http.post(API, data)
        .then(res => {
          this.isAutoSaving = false;
          this.updatedAt = res.data.updatedAt;
          if (!draft) {
            this.$router.push({
              name: 'Articles'
            });
            this.$message.success('保存成功');
          }
        })
        .catch(err => {
          this.isAutoSaving = false;
          throw err;
        });
    }
  },
  components: {
    quillEditor
  }
};
</script>
<style lang="scss" scoped>
.page-view {
  .editor {
    line-height: normal !important;
    border: 1px solid #ccc;
    margin-top: 20px;
    /deep/ {
      pre {
        font-family: Consolas, Monaco, 'Andale Mono', 'Ubuntu Mono', monospace;
      }
      .ql-toolbar {
        border: 0;
        border-bottom: 1px solid #ccc;
      }
      .ql-container {
        font-size: 16px;
        overflow: auto;
        height: 500px;
        border: 0;
      }
      span {
        outline: 0;
      }
      .ql-snow .ql-tooltip[data-mode=link]::before {
        content: "链接地址:";
      }
      .ql-snow .ql-tooltip.ql-editing a.ql-action::after {
          border-right: 0px;
          content: '保存';
          padding-right: 0px;
      }
      .ql-snow .ql-tooltip[data-mode=video]::before {
          content: "视频地址:";
      }

      .ql-snow .ql-picker.ql-size .ql-picker-label::before,
      .ql-snow .ql-picker.ql-size .ql-picker-item::before {
        content: '14px';
      }
      .ql-snow .ql-picker.ql-size .ql-picker-label[data-value=small]::before,
      .ql-snow .ql-picker.ql-size .ql-picker-item[data-value=small]::before {
        content: '10px';
      }
      .ql-snow .ql-picker.ql-size .ql-picker-label[data-value=large]::before,
      .ql-snow .ql-picker.ql-size .ql-picker-item[data-value=large]::before {
        content: '18px';
      }
      .ql-snow .ql-picker.ql-size .ql-picker-label[data-value=huge]::before,
      .ql-snow .ql-picker.ql-size .ql-picker-item[data-value=huge]::before {
        content: '32px';
      }

      .ql-snow .ql-picker.ql-header .ql-picker-label::before,
      .ql-snow .ql-picker.ql-header .ql-picker-item::before {
        content: '文本';
      }
      .ql-snow .ql-picker.ql-header .ql-picker-label[data-value="1"]::before,
      .ql-snow .ql-picker.ql-header .ql-picker-item[data-value="1"]::before {
        content: '标题1';
      }
      .ql-snow .ql-picker.ql-header .ql-picker-label[data-value="2"]::before,
      .ql-snow .ql-picker.ql-header .ql-picker-item[data-value="2"]::before {
        content: '标题2';
      }
      .ql-snow .ql-picker.ql-header .ql-picker-label[data-value="3"]::before,
      .ql-snow .ql-picker.ql-header .ql-picker-item[data-value="3"]::before {
        content: '标题3';
      }
      .ql-snow .ql-picker.ql-header .ql-picker-label[data-value="4"]::before,
      .ql-snow .ql-picker.ql-header .ql-picker-item[data-value="4"]::before {
        content: '标题4';
      }
      .ql-snow .ql-picker.ql-header .ql-picker-label[data-value="5"]::before,
      .ql-snow .ql-picker.ql-header .ql-picker-item[data-value="5"]::before {
        content: '标题5';
      }
      .ql-snow .ql-picker.ql-header .ql-picker-label[data-value="6"]::before,
      .ql-snow .ql-picker.ql-header .ql-picker-item[data-value="6"]::before {
        content: '标题6';
      }

      .ql-snow .ql-picker.ql-font .ql-picker-label::before,
      .ql-snow .ql-picker.ql-font .ql-picker-item::before {
        content: '标准字体';
      }
      .ql-snow .ql-picker.ql-font .ql-picker-label[data-value=serif]::before,
      .ql-snow .ql-picker.ql-font .ql-picker-item[data-value=serif]::before {
        content: '衬线字体';
      }
      .ql-snow .ql-picker.ql-font .ql-picker-label[data-value=monospace]::before,
      .ql-snow .ql-picker.ql-font .ql-picker-item[data-value=monospace]::before {
        content: '等宽字体';
      }
    }
  }
  .auto-save {
    font-size: 14px;
    .icon {
      color: #67C23A;
    }
  }
}

/deep/ {
  .el-page-header {
    .el-page-header__left {
      align-items: center;
    }
    .el-page-header__content {
      flex: 1;
      .content {
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
    }
  }
  .el-drawer {
    .el-drawer__header {
      margin-bottom: 0;
    }
    .content {
      padding: 20px;
    }
  }
}
</style>
