#!/bin/bash

# Vercel 部署自动化脚本
# 用法：./deploy.sh [backend|frontend|all]

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo_info() {
    echo -e "${GREEN}ℹ️  $1${NC}"
}

echo_warn() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

echo_error() {
    echo -e "${RED}❌ $1${NC}"
}

check_vercel_cli() {
    if ! command -v vercel &> /dev/null; then
        echo_error "Vercel CLI 未安装"
        echo_info "正在安装 Vercel CLI..."
        npm install -g vercel
    fi
    echo_info "✓ Vercel CLI 已安装"
}

check_node() {
    if ! command -v node &> /dev/null; then
        echo_error "Node.js 未安装"
        exit 1
    fi
    echo_info "✓ Node.js 版本：$(node -v)"
}

check_pnpm() {
    if ! command -v pnpm &> /dev/null; then
        echo_warn "pnpm 未安装，建议使用 pnpm 进行部署"
        echo_info "安装 pnpm: curl -fsSL https://get.pnpm.io/install.sh | sh -"
    else
        echo_info "✓ pnpm 版本：$(pnpm -v)"
    fi
}

login_vercel() {
    echo_info "登录 Vercel..."
    vercel login
}

deploy_backend() {
    echo_info "开始部署后端..."
    cd server
    
    # 检查 vercel.json
    if [ ! -f "vercel.json" ]; then
        echo_error "server/vercel.json 不存在"
        exit 1
    fi
    
    echo_info "部署到 Vercel（生产环境）..."
    vercel --prod
    
    echo_info "✓ 后端部署完成"
    echo_warn "请记得在 Vercel Dashboard 中配置以下环境变量："
    echo "  - MONGODB_URI"
    echo "  - DB_NAME"
    echo "  - JWT_SECRET"
    echo "  - NODE_ENV=production"
    echo "  - PORT=8899"
    echo "  - FRONTEND_URL (部署前端后填写)"
    
    cd ..
}

deploy_frontend() {
    echo_info "开始部署前端..."
    cd frontend
    
    # 检查 package.json
    if [ ! -f "package.json" ]; then
        echo_error "frontend/package.json 不存在"
        exit 1
    fi
    
    echo_info "部署到 Vercel（生产环境）..."
    vercel --prod
    
    echo_info "✓ 前端部署完成"
    echo_warn "请记得在 Vercel Dashboard 中配置以下环境变量："
    echo "  - REACT_APP_API_URL (指向后端服务 URL)"
    
    cd ..
}

deploy_all() {
    echo_info "===== 开始全栈部署 ====="
    
    # 先部署后端
    deploy_backend
    
    echo ""
    echo_info "等待 10 秒让后端服务启动..."
    sleep 10
    
    # 再部署前端
    deploy_frontend
    
    echo ""
    echo_info "===== 部署完成 ====="
    echo_warn "下一步操作："
    echo "1. 在 Vercel Dashboard 中为后端项目配置环境变量"
    echo "2. 在 Vercel Dashboard 中为前端项目配置 REACT_APP_API_URL"
    echo "3. 更新后端的 FRONTEND_URL 环境变量并重新部署"
    echo "4. 测试前后端通信是否正常"
}

show_help() {
    echo "用法：$0 [backend|frontend|all]"
    echo ""
    echo "参数说明:"
    echo "  backend   - 只部署后端服务"
    echo "  frontend  - 只部署前端应用"
    echo "  all       - 部署整个项目（先后端后前端）"
    echo ""
    echo "示例:"
    echo "  $0 backend    # 部署后端"
    echo "  $0 frontend   # 部署前端"
    echo "  $0 all        # 部署全部"
}

# 主程序
main() {
    echo_info "🚀 Vercel 部署工具"
    echo ""
    
    check_node
    check_pnpm
    check_vercel_cli
    
    echo ""
    
    case "${1:-}" in
        backend)
            login_vercel
            deploy_backend
            ;;
        frontend)
            login_vercel
            deploy_frontend
            ;;
        all)
            login_vercel
            deploy_all
            ;;
        *)
            show_help
            exit 0
            ;;
    esac
}

main "$@"
