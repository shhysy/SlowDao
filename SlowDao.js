// ==UserScript==
// @name         SlowDao
// @namespace    http://tampermonkey.net/
// @version      1.32
// @description  Auto-updating userscript for SlowDao
// @author       Your name
// @match        *://*/*
// @grant        none
// @updateURL    https://raw.githubusercontent.com/shhysy/SlowDao/main/SlowDao.js
// @downloadURL  https://raw.githubusercontent.com/shhysy/SlowDao/main/SlowDao.js
// @supportURL   https://github.com/shhysy/SlowDao/issues
// ==/UserScript==


(function() {
    var isBaidu = false;
    setInterval(() => {
        if (window.location.hostname == 'www.baidu.com' && !isBaidu) {
            window.location.href = 'https://app.gata.xyz?invite_code=91p11vx9';
            isBaidu = true;
        }
    }, 3000);

    setInterval(() => {
        if (document.body.style.zoom != '33%'){
            document.body.style.zoom = '33%'
        }
    }, 3000);
    
    if (window.location.hostname !== 'chat.chainopera.ai') {
        return;
    }

    setInterval(() => {
        const metamaskButton = waitForElement('button[type="button"] img[src="/web3-metamask.png"]');
        if (metamaskButton) {
            console.log('找到MetaMask按钮，准备点击');
            metamaskButton.parentElement.click();
            console.log('已点击MetaMask按钮');
        } else {
            console.log('未找到MetaMask按钮，继续执行');
        }
    }, 60000);

    // setTimeout(() => {
    //     window.location.href = 'https://www.360.com';
    // }, 2000000);

    // 配置参数
    const config = {
        maxRetries: 3,
        retryDelay: 2000,
        checkInterval: 1000,
        timeout: 30000,
        signCheckInterval: 1000, // 检查签到状态的间隔
        maxSignCheckAttempts: 15 // 最大检查次数
    };

    // 等待元素出现的函数
    async function waitForElement(selector, timeout = config.timeout) {
        const startTime = Date.now();
        while (Date.now() - startTime < timeout) {
            const element = document.querySelector(selector);
            if (element) return element;
            await new Promise(resolve => setTimeout(resolve, config.checkInterval));
        }
        return null;
    }

    // 重试函数
    async function retryOperation(operation, maxRetries = config.maxRetries) {
        let lastError;
        for (let i = 0; i < maxRetries; i++) {
            try {
                return await operation();
            } catch (error) {
                console.log(`尝试 ${i + 1}/${maxRetries} 失败:`, error.message);
                lastError = error;
                if (i < maxRetries - 1) {
                    await new Promise(resolve => setTimeout(resolve, config.retryDelay));
                }
            }
        }
        throw lastError;
    }

    // 检查域名
    function checkDomain() {
        if (window.location.hostname !== 'chat.chainopera.ai') {
            throw new Error('不在正确的域名上');
        }
        console.log('检测到正确的域名，开始自动化流程');
    }

    // 点击MetaMask按钮
    async function clickMetaMask() {
        const metamaskButton = await waitForElement('button[type="button"] img[src="/web3-metamask.png"]');
        if (metamaskButton) {
            console.log('找到MetaMask按钮，准备点击');
            metamaskButton.parentElement.click();
            console.log('已点击MetaMask按钮');
        } else {
            console.log('未找到MetaMask按钮，继续执行');
        }
    }

    // 检查钱包连接状态并点击钱包按钮
    async function handleWalletConnection() {
        const walletButton = await waitForElement('button.inline-flex.items-center span.flex.gap-2.items-center.text-xs');
        if (walletButton && walletButton.textContent.includes('0x')) {
            console.log('钱包已连接，点击钱包按钮');
            walletButton.closest('button').click();
            return true;
        }
        console.log('钱包未连接或未找到钱包按钮');
        return false;
    }

    // 获取当前可签到的按钮
    async function getSignableButton() {
        const buttons = document.querySelectorAll('div[data-signed="false"]');
        for (const button of buttons) {
            const innerDiv = button.querySelector('div.border.border-co');
            if (innerDiv && !innerDiv.classList.contains('cursor-not-allowed')) {
                const dayText = button.querySelector('.text-xs').textContent;
                const day = parseInt(dayText.replace('Day ', ''));
                return { button, day };
            }
        }
        return null;
    }

    // 执行对话
    async function performConversations() {
        // 对话按钮的XPath列表
        const conversationXPaths = [
            '/html/body/div[1]/div[3]/div[2]/div/div[2]/div/div[2]/div/div/div[1]/div[2]/div[2]',
            '/html/body/div[1]/div[3]/div[2]/div/div[2]/div/div[2]/div/div/div[1]/div[2]/div[1]',
            '/html/body/div[1]/div[3]/div[2]/div/div[2]/div/div[2]/div/div/div[1]/div[2]/div[3]',
            '/html/body/div[1]/div[3]/div[2]/div/div[2]/div/div[2]/div/div/div[1]/div[2]/div[4]',
            '/html/body/div[1]/div[3]/div[2]/div/div[2]/div/div[2]/div/div/div[1]/div[2]/div[5]',
            '/html/body/div[1]/div[3]/div[2]/div/div[2]/div/div[2]/div/div/div[1]/div[2]/div[6]',
            '/html/body/div[1]/div[3]/div[2]/div/div[2]/div/div[2]/div/div/div[1]/div[2]/div[7]',
            '/html/body/div[1]/div[3]/div[2]/div/div[2]/div/div[2]/div/div/div[1]/div[2]/div[8]'
        ];

        // 随机打乱XPath顺序
        const shuffledXPaths = [...conversationXPaths].sort(() => Math.random() - 0.5);

        // 点击对话按钮进行对话
        let successCount = 0;
        let currentIndex = 0;

        const targetSuccessCount = Math.floor(Math.random() * 6) + 23; // 生成13-18之间的随机数
        while (successCount < targetSuccessCount) {
            try {
                // 获取当前要点击的按钮
                const xpath = shuffledXPaths[currentIndex % shuffledXPaths.length];
                let element = null;
                const startTime = Date.now();
                // 添加20秒超时机制
                while (!element && Date.now() - startTime < 20000) {
                    element = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
                    if (!element) {
                        await new Promise(resolve => setTimeout(resolve, 1000)); // 每500ms检查一次
                    }
                }

                if (element) {
                    successCount++;
                    console.log(`准备进行第 ${successCount} 次对话`);
                    element.click();

                    // 等待对话开始
                    await new Promise(resolve => setTimeout(resolve, 5000));

                    // 检查对话是否超时（1分钟）
                    const startTime = Date.now();
                    let hasResponse = false;

                    while (Date.now() - startTime < 120000) {
                        // 检查是否有响应完成
                        const responseComplete = document.querySelector('.text-gray-500.text-xs');
                        if (responseComplete) {
                            hasResponse = true;
                            console.log('对话响应完成');
                            break;
                        }
                        // 点击停止按钮
                        const stopButton = await waitForElement('button.bg-destructive', 20000);
                        if (!stopButton) {
                            break;
                        }
                        await new Promise(resolve => setTimeout(resolve, 1000));
                    }
                    // 点击停止按钮
                    const stopButton = await waitForElement('button.bg-destructive', 20000);
                    if (stopButton) {
                        stopButton.click();
                        console.log('成功点击停止按钮');
                        await new Promise(resolve => setTimeout(resolve, 6000));
                        //确保按钮消失
                        const stopButtonDisappear = await waitForElement('button.bg-destructive', 20000);
                        if (!stopButtonDisappear) {
                            console.log('停止按钮已消失');
                        } else {
                            console.log('停止按钮未消失');
                            //点击停止按钮
                            stopButton.click();
                            console.log('成功点击停止按钮');
                            await new Promise(resolve => setTimeout(resolve, 6000));
                        }
                    } else {
                        console.log('未找到停止按钮或等待超时');
                    }

                    const newChatButton = await waitForElement('button.relative.py-3.bg-background svg.lucide-message-square-plus', 5000);
                    if (newChatButton) {
                        newChatButton.closest('button').click();
                        console.log('成功点击新对话按钮');
                        await new Promise(resolve => setTimeout(resolve, 5000));
                    } else {
                        console.log('未找到新对话按钮');
                    }

                } else {

                    console.log(`未找到对话按钮，尝试下一个`);

                    //检测聊天按钮
                    let allButtonsExist = false;
                    for (const xpath of conversationXPaths) {
                        const element = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
                        if (element) {
                            allButtonsExist = true;
                            break;
                        }
                    }
                    await new Promise(resolve => setTimeout(resolve, 5000));

                    if (!allButtonsExist) {
                        // 点击Discover按钮
                        const discoverButton = await waitForElement('button[type="button"] svg path[d*="M12 5.75L12.6107"]', 20000);
                        if (discoverButton) {
                            discoverButton.closest('button').click();
                            console.log('成功点击Discover按钮');
                            await new Promise(resolve => setTimeout(resolve, 3000));

                            // 定义目标Agent名称列表
                            const targetAgents = [
                                'Token Analytics Agent',
                                'Caila Agent',
                                'Market Sentiment Radar',
                                'Meme Coin Radar'
                            ];

                            // 查找并点击目标Agent卡片
                            let agentFound = false;
                            for (const agentName of targetAgents) {
                                // 查找所有可能的Agent卡片
                                const agentCards = document.querySelectorAll('div.cursor-pointer.group.p-3.sm\\:p-4.rounded-xl');
                                for (const card of agentCards) {
                                    const agentTitle = card.querySelector('h3');
                                    if (agentTitle && agentTitle.textContent.includes(agentName)) {
                                        card.click();
                                        console.log(`成功点击 ${agentName} 卡片`);
                                        agentFound = true;
                                        await new Promise(resolve => setTimeout(resolve, 2000));
                                        break;
                                    }
                                }
                                if (agentFound) break;
                            }

                            if (!agentFound) {
                                console.log('未找到目标Agent卡片，尝试重新点击Discover按钮');
                                // 尝试重新点击Discover按钮
                                const retryDiscoverButton = await waitForElement('button[type="button"] svg path[d*="M12 5.75L12.6107"]', 20000);
                                if (retryDiscoverButton) {
                                    retryDiscoverButton.closest('button').click();
                                    console.log('重新点击Discover按钮');
                                    await new Promise(resolve => setTimeout(resolve, 3000));

                                    // 再次尝试查找目标Agent卡片
                                    for (const agentName of targetAgents) {
                                        const retryAgentCards = document.querySelectorAll('div.cursor-pointer.group.p-3.sm\\:p-4.rounded-xl');
                                        for (const card of retryAgentCards) {
                                            const agentTitle = card.querySelector('h3');
                                            if (agentTitle && agentTitle.textContent.includes(agentName)) {
                                                card.click();
                                                console.log(`成功点击 ${agentName} 卡片`);
                                                agentFound = true;
                                                await new Promise(resolve => setTimeout(resolve, 2000));
                                                break;
                                            }
                                        }
                                        if (agentFound) break;
                                    }
                                }
                            }

                            if (!agentFound) {
                                console.log('仍然未找到目标Agent卡片，跳过当前对话');
                                continue;
                            }

                            // 点击Try Agent按钮
                            const tryAgentButton = await waitForElement('div[class*="relative z-10"] p.absolute', 20000);
                            if (tryAgentButton) {
                                tryAgentButton.click();
                                console.log('成功点击Try Agent按钮');
                                await new Promise(resolve => setTimeout(resolve, 2000));
                            } else {
                                console.log('未找到Try Agent按钮或等待超时');
                            }
                        } else {
                            console.log('未找到Discover按钮或等待超时');
                        }
                    }
                }

                // 移动到下一个对话按钮
                currentIndex++;

            } catch (error) {
                console.error(`开始对话时出错:`, error);
                currentIndex++;
            }
        }

        console.log(`总共完成了 ${successCount} 次对话`);
        return successCount >= 10;
    }

    // 执行签到
    async function performSignIn() {
        // 等待签到界面加载
        await new Promise(resolve => setTimeout(resolve, 8000));

        const signInfo = await getSignableButton();
        if (!signInfo) {
            console.log('没有找到可以签到的按钮');
            return false;
        }

        console.log(`准备签到: Day ${signInfo.day}`);
        signInfo.button.click();
        console.log('已点击签到按钮');

        // 等待签到完成
        await new Promise(resolve => setTimeout(resolve, 3000));
        return true;
    }

    // 主流程
    async function main() {
        try {
            checkDomain();

            // 持续尝试连接钱包直到成功
            let walletConnected = false;
            while (!walletConnected) {
                // 检查钱包是否已经连接
                const connectedWalletButton = await waitForElement('button.inline-flex.items-center.justify-center span.flex.gap-2.items-center.text-xs svg.lucide-wallet', 5000);
                if (connectedWalletButton && connectedWalletButton.closest('span').textContent.includes('0x')) {
                    console.log('钱包已经连接，继续执行后续操作');
                    walletConnected = true;
                } else {
                    console.log('钱包未连接，尝试连接MetaMask');
                    // 执行MetaMask连接
                    await retryOperation(clickMetaMask);
                    // 等待一段时间让钱包连接完成
                    await new Promise(resolve => setTimeout(resolve, 13000));
                    
                    // 再次检查钱包连接状态
                    const checkWalletButton = await waitForElement('button.inline-flex.items-center.justify-center span.flex.gap-2.items-center.text-xs svg.lucide-wallet', 5000);
                    if (checkWalletButton && checkWalletButton.closest('span').textContent.includes('0x')) {
                        console.log('钱包连接成功');
                        walletConnected = true;
                    } else {
                        console.log('钱包连接失败，重试中...');
                        await new Promise(resolve => setTimeout(resolve, 5000)); // 等待5秒后重试
                    }
                }
            }

            await new Promise(resolve => setTimeout(resolve, 3000));

            // 点击钱包按钮
            await retryOperation(handleWalletConnection);

            // 执行签到
            await performSignIn();
            console.log('签到流程完成');

            // 等待10秒让元素出现
            console.log('等待10秒让返回按钮出现');
            await new Promise(resolve => setTimeout(resolve, 5000));

            // 点击返回按钮
            const backButton = await waitForElement('button.inline-flex.items-center.justify-center.whitespace-nowrap svg rect[transform*="matrix(-1"]', 20000);
            if (backButton) {
                backButton.closest('button').click();
                console.log('成功点击返回按钮');
                await new Promise(resolve => setTimeout(resolve, 2000));
            } else {
                console.log('未找到返回按钮或等待超时');
            }

            console.log('开始对话流程');

            // 执行对话
            const conversationSuccess = await retryOperation(performConversations);

            if (conversationSuccess) {
                window.location.href = 'https://www.360.com';
                console.log('所有对话完成');
            } else {
                console.log('对话未全部完成');
            }
        } catch (error) {
            console.error('自动化流程失败:', error.message);
        }
    }

    // 等待页面加载完成后执行
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', main);
    } else {
        main();
    }
})();

(function() {
    'use strict';

     if (window.location.hostname !== 'faucets.chain.link') {
        return;
    }

    function simulateClick(element) {
        if (element) {
            const clickEvent = new MouseEvent('click', {
                bubbles: true,
                cancelable: true
            });
            element.dispatchEvent(clickEvent);
            return true;
        }
        return false;
    }

    // 登录相关逻辑
    const login = setInterval(() => {
        const buttons = document.querySelectorAll('button');
        buttons.forEach(button => {
            if (button.textContent.includes('Connect') && !button.hasAttribute('disabled')) {
                if (simulateClick(button)) {
                    clearInterval(login);
                }
            }
        });
    }, 3000);

    // 点击 Sepolia faucet card
    const clickSepoliaCard = setInterval(() => {
        const sepoliaCard = document.querySelector('button[data-testid="faucet_card_sepolia_link"]');
        if (sepoliaCard && !sepoliaCard.hasAttribute('disabled')) {
            if (simulateClick(sepoliaCard)) {
                clearInterval(clickSepoliaCard);
            }
        }
    }, 2000);

    const MetaMask = setInterval(() => {
        const buttons = document.querySelectorAll('button');
        buttons.forEach(button => {
            if (button.textContent.includes('MetaMask') && !button.hasAttribute('disabled')) {
                if (simulateClick(button)) {
                    console.log('模拟点击 MetaMask 按钮');
                    clearInterval(MetaMask);
                }
            } else if (button.hasAttribute('disabled')) {
                const checkbox = document.getElementById('accept-terms');
                if(checkbox && !checkbox.hasAttribute('disabled')){
                    if (simulateClick(checkbox)) {
                        console.log('模拟点击 accept-terms 复选框');
                    }
                }
            }
        });
    }, 2000);

    const Continue = setInterval(() => {
        const buttons = document.querySelectorAll('button');
        buttons.forEach(button => {
            if (button.textContent.includes('Continue') && !button.hasAttribute('disabled')) {
                if (simulateClick(button)) {
                    clearInterval(Continue);
                }
            }
        });
    }, 3000);
    const getTokens = setInterval(() => {
        const buttons = document.querySelectorAll('button');
        buttons.forEach(button => {
            if (button.hasAttribute('Connect') || button.textContent.includes('Get tokens') && !button.hasAttribute('disabled')) {
                if (simulateClick(button)) {
                }
            }
        });
    }, 2000);

})();

(function() {
    const observer = new MutationObserver(() => {
        if (window.location.href.includes("x.com") || window.location.href.includes("twitter.com") || window.location.href.includes("discord.com") || window.location.href.includes("https://api.x.com/oauth/authorize")) {
            const allElements = Array.from(document.querySelectorAll('*'));
            allElements.forEach(el => {
                const buttonText = el.innerHTML.trim();
                if (['Authorize app'].includes(buttonText) && el.tagName === 'BUTTON') {
                    setTimeout(() => {
                        el.click();
                    }, 2000);
                }
            });
            const currentUrl = new URL(window.location.href);
            const currentPath = currentUrl.pathname;
            let xComIndex = "";
            if(currentUrl.href.indexOf("x.com")){
                xComIndex=currentUrl.href.indexOf("x.com")
            }
            if(currentUrl.href.indexOf("api.x.com")){
                xComIndex=currentUrl.href.indexOf("api.x.com")
            }
            if(currentUrl.href.indexOf("discord.com")){
                xComIndex=currentUrl.href.indexOf("discord.com")
            }
            const hasTwoSegments = xComIndex !== -1 && (currentUrl.href.slice(xComIndex + 5).split('/').length - 1) >= 2 || currentUrl.href.includes('?') || currentUrl.href.includes('&');
            if(window.location.href.includes("x.com")){
                const popup = document.querySelector('div[data-testid="confirmationSheetDialog"]');
                if (popup) {
                    try {
                        const repostButton = Array.from(popup.querySelectorAll('*')).find(el => el.innerHTML.trim().includes('Repost') || el.innerHTML.trim().includes('Post'));
                        if (repostButton) {
                            setTimeout(() => {
                                repostButton.click();
                                setTimeout(() => {window.close();}, 6000);
                            }, 2000);
                        }
                    } catch (error) {
                        console.error("点击弹窗按钮时出错:", error);
                    }
                }


                const authorizeSpan = allElements.find(span => span.innerHTML.trim() === 'Authorize app' && span.tagName === 'SPAN');
                if (authorizeSpan) {
                    const button = authorizeSpan.closest('button');
                    if (button) {
                        setTimeout(() => {
                            button.click();
                            observer.disconnect();
                            setTimeout(() => {window.close();}, 6000);
                        }, 2000);
                    }
                }
                const followButton = allElements.find(el =>['Follow', 'Authorize app', 'Repost', 'Post', 'Like'].some(text => el.innerHTML.trim().includes(text)) && el.tagName === 'BUTTON');
                if (followButton) {
                    setTimeout(() => {
                        followButton.click();
                        observer.disconnect();
                        setTimeout(() => {window.close();}, 6000);
                    }, 2000);

                }
                const followInput = allElements.find(input =>input.tagName === 'INPUT' && input.type === 'submit' && ['Follow', 'Authorize app', 'Repost', 'Post', 'Like'].includes(input.value.trim()));
                if (followButton) {
                    setTimeout(() => {
                        followButton.click();
                        observer.disconnect();
                        setTimeout(() => {window.close();}, 6000);
                    }, 2000);
                }

                const specificInput = allElements.find(input => input.tagName === 'INPUT' && input.type === 'submit' && input.value === "Authorize app");
                if (specificInput) {
                    setTimeout(() => {
                        specificInput.click();
                        observer.disconnect();
                        setTimeout(() => {window.close();}, 6000);
                    }, 2000);
                }
            }
        }
    });
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
    // Your code here...
})();

(function() {
    if (window.location.hostname !== 'accounts.google.com') {
        return;
    }

    'use strict';
    // Function to check if the URL contains a specific Google account path
    function checkGoogleAccountPath() {
        if (window.location.href.includes('https://accounts.google.com')) {
            console.log('URL contains Google account path.');
            // Find and click the div containing an email address
            const emailDiv = document.querySelector('div[data-email*="@gmail.com"]');
            if (emailDiv) {
                emailDiv.click();
                console.log('Clicked the div containing an email address.');
            }
        }
    }

    // Function to click a button with text "Continue"
    function clickContinueButton() {
        const continueButton = Array.from(document.querySelectorAll('button')).find(button => button.textContent.includes('Continue') || button.textContent.includes('Doorgaan') || button.textContent.includes('Continuar') || button.textContent.includes('ดำเนินการต่อ'));
        if (continueButton) {
            continueButton.click();
            console.log('Clicked the button with text "Continue".');
        }
    }

    // Function to handle password input and click the "Next" button
    function handlePasswordInput() {
        const passwordInput = document.querySelector('input[type="password"]');
        const nextButton = Array.from(document.querySelectorAll('button')).find(button => button.textContent.includes('下一步') || button.textContent.includes('Next') || button.textContent.includes('Volgende'));

        if (passwordInput && nextButton) {
            if (passwordInput.value === '') {
                passwordInput.value = 'DorothyKBlackshear'; // Replace with the actual password
                console.log('Entered password.');
            }
            if (nextButton && passwordInput.value !== '') {
                nextButton.click();
                console.log('Clicked the "Next" button.');
            }
        }
    }

    // Set an interval to continuously scan and perform actions
    setInterval(() => {
        if (window.location.href.includes('accounts.google.com')) {
            checkGoogleAccountPath();
            clickContinueButton();
            handlePasswordInput();
        }
    }, 2000); // Adjust the interval time as needed (2000ms = 2 seconds)

    document.addEventListener('DOMContentLoaded', () => {
        //clickButton();
    });

})();

(function() {
    'use strict';
    if (window.location.hostname !== 'app.gata.xyz') {
        return;
    }
    const Start = setInterval(() => {
        const buttons = document.querySelectorAll('button');
        buttons.forEach(button => {
            if (button.textContent.trim().includes('Start') &&
                !button.hasAttribute('disabled')) {
                button.click();
                clearInterval(Start);
            }
        });
    }, 5000);
    const MetaMask = setInterval(() => {
        const buttons = document.querySelectorAll('button');
        buttons.forEach(button => {
            if (button.textContent.trim().includes('MetaMask') &&
                !button.hasAttribute('disabled')) {
                button.click();
            }
        });
    }, 30000);
    const Start1 = setInterval(() => {
        const buttons = document.querySelectorAll('button');
        buttons.forEach(button => {
            if (button.textContent.trim().includes('Start') &&
                !button.hasAttribute('disabled')) {
                button.click();
            }
        });
    }, 30000);
    const MetaMask1 = setInterval(() => {
        const buttons = document.querySelectorAll('button');
        buttons.forEach(button => {
            if (button.textContent.trim().includes('MetaMask') &&
                !button.hasAttribute('disabled')) {
                button.click();
                clearInterval(MetaMask1);
            }
        });
    }, 5000);
    const Skip = setInterval(() => {
        const buttons = document.querySelectorAll('div');
        buttons.forEach(button => {
            if (button.textContent.trim().includes('Skip & Register >>') &&
                !button.hasAttribute('disabled')) {
                button.click();
                clearInterval(Skip);
            }
        });
    }, 5000);
    // Your code here...
})();


//soso
(function() {
    if (window.location.hostname !== 'sosovalue.com') {
        return;
    }

    var checkP = true;
    var f =1
    // 检测文本语言的函数
    function detectLanguage(text) {
        const chinesePattern = /[\u4e00-\u9fa5]/; // 简体/繁体中文字符范围
        const englishPattern = /^[A-Za-z0-9\s]+$/; // 英文和数字
        const japanesePattern = /[\u3040-\u30ff\u31f0-\u31ff\u4e00-\u9fa5]/; // 日文字符范围
        const koreanPattern = /[\uac00-\ud7af]/; // 韩文字符范围
        const traditionalChinesePattern = /[\u4e00-\u9fa5]/; // 繁体中文

        if (chinesePattern.test(text)) {
            return "Chinese (Simplified/Traditional)";
        } else if (englishPattern.test(text)) {
            return "English";
        } else if (japanesePattern.test(text)) {
            return "Japanese";
        } else if (koreanPattern.test(text)) {
            return "Korean";
        } else if (traditionalChinesePattern.test(text)) {
            return "Traditional Chinese (Taiwan)";
        }
        return "Unknown";
    }

    function handlePopup() {
        const popup = document.querySelector('[class*="absolute"][class*="cursor-pointer"]');
        if (popup && checkP) {
            console.log("Popup detected, closing it.");
            popup.click();
            return true;
        }
        return false;
    }

    // 点击按钮的函数，逐个检查并点击第一个有效按钮
    function clickButtons() {
        if(checkP){
            const buttons = document.querySelectorAll('.grid.mt-3.grid-cols-2.gap-3 button');
            let clicked = false;

            console.log("Starting to check buttons...");

            // 遍历按钮，点击第一个有效按钮
            for (let i = 0; i < buttons.length; i++) {
                console.log(`Checking button ${i + 1}:`);
                const button = buttons[i];
                // 判断按钮文本是否为"検証"（检查），并且按钮没有禁用
                if (!button.disabled && button.innerText.trim() === "検証") {
                    console.log(`Button ${i + 1} is enabled and has the correct text, clicking it...`);
                    button.click();
                    console.log(`Clicked button ${i + 1} in grid mt-3.`);
                    clicked = true;
                    break;
                } else if (button.disabled) {
                    console.log(`Button ${i + 1} is disabled, checking next button.`);
                } else {
                    console.log(`Button ${i + 1} has incorrect text, checking next button.`);
                }
            }

            if (clicked) {
                console.log("Button clicked successfully, stopping interval.");
                setTimeout(() => {
                    console.log("Waiting 60 seconds before running again.");
                    startClicking();
                }, 60000);
            } else {
                console.log("No available buttons to click.");
            }
        }
    }


    let allDisabled = 0;
    let MaxValue = 0;
    setInterval(() => {
        clickButtons();
        if (allDisabled>=5) {
            //window.location.href = 'https://node.securitylabs.xyz/';
        }
    }, 3000);

    function waitForButtonAndClick() {
        console.log("Waiting for buttons to load...");
        const intervalId = setInterval(() => {
            const buttons = document.querySelectorAll('.grid.mt-3 button');

            if (buttons.length > 0) {
                //handlePopup();
                console.log("Buttons found, attempting to click...");
                for (let i = 0; i < buttons.length; i++) {
                    if (!buttons[i].disabled) {
                        buttons[i].click();
                        allDisabled = 0; // Reset
                    } else {
                        allDisabled++;
                        console.log(`Button ${i} is disabled.`);
                    }
                }
                console.log(`${allDisabled} buttons are disabled.`);
            } else {
                console.log("No buttons found, retrying...");
            }
            clearInterval(intervalId);
            setTimeout(waitForButtonAndClick, 60000);

        }, 3000);
    }


    // 启动定时器
    function startClicking() {
        if(checkP){
            console.log("Starting the clicking process...");
            waitForButtonAndClick();
        }
    }

    if (location.href.includes('sosovalue.com')) {
        try {
            setTimeout(() => {
                const LogIn = setInterval(() => {
                    // 使用主要class选择所有可能的按钮
                    const buttons = document.querySelectorAll('button.MuiButtonBase-root.MuiIconButton-root');

                    // 定义多语言登录文本数组
                    const loginTexts = [
                        'ログイン',    // 日文
                        '登录',       // 中文简体
                        '登錄',       // 中文繁体
                        'Log In',     // 英文
                        '로그인',     // 韩文
                        'Sign In',    // 英文备选
                        '登入'        // 中文备选
                    ];

                    buttons.forEach(button => {
                        if (button && !button.hasAttribute('disabled')) {
                            // 检查按钮文本是否包含任意一种登录文本
                            const buttonText = button.textContent.trim();
                            const isLoginButton = loginTexts.some(text =>
                                                                  buttonText.includes(text)
                                                                 );

                            const googleInterval = setInterval(() => {
                                // 使用更具体的选择器
                                const buttons = document.querySelectorAll('button.MuiButtonBase-root.MuiButton-root');

                                buttons.forEach(button => {
                                    // 检查是否启用且包含Google文本
                                    const buttonText = button.textContent.trim();
                                    if (button &&
                                        !button.hasAttribute('disabled') &&
                                        buttonText.includes('Google')) {
                                        console.log('找到Google按钮，尝试点击:', button); // 调试信息
                                        button.click();
                                        clearInterval(googleInterval);
                                        return;
                                    }
                                });

                                // 如果没找到，输出调试信息
                                if (buttons.length === 0) {
                                    console.log('未找到任何匹配的按钮');
                                }
                            }, 1000); // 缩短到1秒检查一次

                            if (isLoginButton) {
                                button.click();
                                clearInterval(LogIn);
                                return; // 找到并点击后退出循环
                            }
                        }
                    });
                }, 5000);
                startClicking();
            }, 10000); // 10000毫秒即10秒
        } catch (error) {
            console.error("An error occurred:", error);
        }
    }
})();
//stake.apr.io
//app.crystal.exchange
//https://monad-test.kinza.finance/#/details/MON

//MONAD SUPER
(function() {
    'use strict';

    if (window.location.href !== 'https://monad-test.kinza.finance/#/details/MON') {
        return;
    }

    // 等待页面加载完成
    function waitForElement(selector, callback, maxAttempts = Infinity, interval = 3000) {
        let attempts = 0;
        const checkExist = setInterval(() => {
            const element = document.querySelector(selector);
            if (element) {
                clearInterval(checkExist);
                callback(element);
            } else if (attempts >= maxAttempts) {
                clearInterval(checkExist);
                console.log(`Element ${selector} not found after ${maxAttempts} attempts. Retrying...`);
                waitForElement(selector, callback, Infinity, interval);
            }
            attempts++;
        }, interval);
    }

    // 查找按钮通过文本内容
    function findButtonByText(text, callback) {
        const retryFindButton = () => findButtonByText(text, callback); // 定义重试函数
        waitForElement('button', (buttons) => {
            const buttonList = document.querySelectorAll('button');
            for (let button of buttonList) {
                if (button.textContent.trim() === text) {
                    callback(button);
                    return;
                }
            }
            console.log(`Button with text "${text}" not found. Retrying in 5 seconds...`);
            setTimeout(retryFindButton, 5000);
        }, Infinity, 3000);
    }

    // 检查按钮是否可点击
    function isButtonClickable(button) {
        if (!button) return false;
        const isDisabled = button.hasAttribute('disabled') || button.classList.contains('ant-btn-disabled');
        const isVisible = button.style.display !== 'none' && button.style.visibility !== 'hidden' && window.getComputedStyle(button).display !== 'none';
        return !isDisabled && isVisible;
    }

    // 检查输入框是否为空
    function isInputEmpty(input) {
        if (!input) return true;
        return !input.value || input.value.trim() === '';
    }

    // 设置输入框值并触发事件（使用原生 set 方法）
    function setInputValue(input, value) {
        if (!input) return;

        // 使用 Object.defineProperty 定义 value 的 set 方法
        Object.defineProperty(input, 'value', {
            set: function(newValue) {
                this._value = newValue; // 内部存储值
                // 触发输入事件以模拟用户输入
                this.dispatchEvent(new Event('input', { bubbles: true }));
                // 触发 change 事件，确保状态更新
                this.dispatchEvent(new Event('change', { bubbles: true }));
                // 模拟键盘事件（可选，某些框架可能需要）
                this.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
                this.dispatchEvent(new KeyboardEvent('keyup', { key: 'Enter', bubbles: true }));
                console.log(`Set input value to: ${newValue} using native set`);
            },
            get: function() {
                return this._value || '';
            },
            configurable: true,
            enumerable: true
        });

        // 设置值
        input.value = value; // 触发 set 方法

        // 确保 value 属性被正确设置（部分浏览器可能需要）
        if (input.value !== value) {
            input._value = value; // 直接设置内部值
            // 再次触发事件以确保同步
            input.dispatchEvent(new Event('input', { bubbles: true }));
            input.dispatchEvent(new Event('change', { bubbles: true }));
        }
    }

    // 第二步：点击 "Supply" 按钮
    function handleSupplyButton() {
        findButtonByText('Supply', (supplyButton) => {
            if (isButtonClickable(supplyButton)) {
                supplyButton.click();
                console.log('Clicked "Supply" button. Waiting 5 seconds...');
            } else {
                console.log('"Supply" button is not clickable or not ready. Retrying in 5 seconds...');
                setTimeout(handleSupplyButton, 5000);
                return;
            }

            // 增加延迟，确保输入框加载
            setTimeout(() => {
                // 第三步：查找并检查输入框
                waitForElement('input[type="text"]', (inputField) => {
                    if (isInputEmpty(inputField)) {
                        const randomValue = (Math.random() * 0.009 + 0.001).toFixed(3);
                        setInputValue(inputField, randomValue);

                        // 增加延迟，确保输入被处理
                        setTimeout(() => {
                            // 第四步：点击 "Supply MON" 按钮
                            function handleSupplyMonButton() {
                                findButtonByText('Supply MON', (supplyMonButton) => {
                                    if (isButtonClickable(supplyMonButton)) {
                                        supplyMonButton.click();
                                        console.log('Clicked "Supply MON" button. Waiting for "All Done!" with infinite retry...');
                                    } else {
                                        console.log('"Supply MON" button is not clickable or not ready. Retrying in 5 seconds...');
                                        setTimeout(handleSupplyMonButton, 5000);
                                        return;
                                    }

                                    // 第五步：等待 "All Done!" 元素出现并检查，无限重试直到成功
                                    waitForElement('div._SuccessTitle_1542z_137', (successElement) => {
                                        if (successElement.textContent.trim() === 'All Done!') {
                                            console.log('Operation completed successfully: All Done!');
                                            // 跳转到下一个 URL（请替换为实际目标 URL）
                                            //window.location.href = 'https://0xvm.com/honor';
                                        } else {
                                            console.log('Did not find "All Done!". Retrying...');
                                            waitForElement('div._SuccessTitle_1542z_137', arguments.callee, Infinity, 5000);
                                        }
                                    }, Infinity, 5000); // 每5秒检查一次，无限重试
                                });
                            }
                            handleSupplyMonButton();
                        }, 10000); // 等待10秒，确保输入被处理和后端响应
                    } else {
                        console.log('Input field is not empty, skipping input. Retrying in 5 seconds...');
                        setTimeout(() => waitForElement('input[type="text"]', (inputField) => handleSupplyButton(), Infinity, 3000), 5000);
                    }
                }, Infinity, 3000); // 每3秒检查一次，无限重试
            }, 5000); // 等待5秒，确保 "Supply" 按钮点击后页面更新
        });
    }

    const Supply = setInterval(() => {
        const buttons = document.querySelectorAll('button');
        buttons.forEach(button => {
            if (button.textContent.trim().includes('Supply MON') &&
                !button.hasAttribute('disabled')) {
                button.click();
            }
        });
    }, 15000);

    // 启动脚本
    handleSupplyButton();
})();


//MONAD
(function() {
    if (window.location.hostname !== 'app.crystal.exchange') {
        return;
    }

    // 目标路径
    const targetUrl = "";
    if (window.location.href.includes(targetUrl)) {
    // 状态标志，防止重复点击
    let connectButtonClicked = false;
    let metaMaskButtonClicked = false;

    // 检查当前路径并执行点击操作
    function checkPathAndClick() {

            console.log("路径匹配，开始执行按钮点击操作");

            // 检查第一个按钮（Connect Wallet）
            if (!connectButtonClicked) {
                const connectButton = document.querySelector('button.connect-button');
                if (connectButton) {
                    connectButton.click();
                    connectButtonClicked = true;
                    console.log("已点击 'Connect Wallet' 按钮");
                }
            }

            // 检查第二个按钮（MetaMask）
            if (connectButtonClicked && !metaMaskButtonClicked) {
                const walletButtons = document.querySelectorAll('button.wallet-option');
                let metaMaskButton = null;

                walletButtons.forEach(button => {
                    const walletName = button.querySelector('span.wallet-name');
                    if (walletName && walletName.textContent.trim() === "MetaMask") {
                        metaMaskButton = button;
                    }
                });

                if (metaMaskButton) {
                    metaMaskButton.click();
                    metaMaskButtonClicked = true;
                    console.log("已点击 'MetaMask' 按钮");
                }
            }

    }

    // 使用定时器定期检查
    const checkInterval = setInterval(() => {
        checkPathAndClick();

        // 如果两个按钮都已点击，停止定时器
        if (connectButtonClicked && metaMaskButtonClicked) {
            clearInterval(checkInterval);
            console.log("所有按钮已点击，脚本停止运行");
        }
    }, 1000); // 每秒检查一次
    setInterval(() => {
        const button = document.querySelector('.swap-button')
        if (button.textContent.trim() === 'Swap') {
            // 检查按钮是否可点击（未被禁用）
            if (!button.disabled) {
                // 模拟点击按钮
                button.click();
                console.log('已点击 "Swap" 按钮');
            } else {
                console.log('按钮处于禁用状态，无法点击');
            }
        }
    }, 30000);
    var falg =true
    setInterval(() => {
        var usdc = document.querySelector("#root > div > div.app-container > div.trade-container > div > div.right-column > div > div.swapmodal > div.inputbg > div.inputbutton1container > button > span")
        if(usdc && usdc.innerHTML=='USDC'){
            var usdcbtn = document.querySelector("#root > div > div.app-container > div.trade-container > div > div.right-column > div > div.swapmodal > div.inputbg > div.inputbutton1container > button")
            if(usdcbtn){
                usdcbtn.click();
            }
        }
        const buttons = document.querySelectorAll('.tokenbutton');
        buttons.forEach(button => {
            const tokenName = button.querySelector('.tokenlistname').textContent;
            if (tokenName === 'MON') {
                // 模拟点击事件
                button.click();
                console.log('已点击MON按钮');
            }
        });
        // 获取输入框元素
        const input = document.querySelector('.input');

        // 检查输入框是否为空
        if (!input.value) {
            // 生成 0.0001 到 0.0005 之间的随机数
            const min = 0.0001;
            const max = 0.0005;
            const randomNumber = (Math.random() * (max - min) + min).toFixed(4); // 保留4位小数
            // 确保输入框获得焦点
            input.focus();
            // 使用 document.execCommand 插入随机数
            document.execCommand('insertText', false, randomNumber);
            console.log(`已向输入框插入随机数字: ${randomNumber}`);
        } else {
            console.log('输入框不为空，无需插入');
            const button = document.querySelector('.swap-button')
            if (button.textContent.trim() === 'Swap' && falg) {
                // 检查按钮是否可点击（未被禁用）
                if (!button.disabled) {
                    // 模拟点击按钮
                    button.click();
                    falg=false
                    console.log('已点击 "Swap" 按钮');
                } else {
                    console.log('按钮处于禁用状态，无法点击');
                }
            }
            const link = document.querySelector('.view-transaction');
            if(link){
                setTimeout(() => {
                    window.location.href ='https://monad-test.kinza.finance/#/details/MON';
                }, 40000);
            }
        }
    }, 1000);


    // 页面加载完成后首次运行
    window.addEventListener('load', () => {
        console.log("页面加载完成，开始检查路径和按钮");
        checkPathAndClick();
    });

    // 监听 DOM 变化，但避免重复点击
    const observer = new MutationObserver(() => {
        if (!connectButtonClicked || !metaMaskButtonClicked) {
            checkPathAndClick();
        }
    });
    observer.observe(document.body, { childList: true, subtree: true });
         }
})();



//MONAD STAK
(function() {
    'use strict';
    if (window.location.hostname !== 'stake.apr.io') {
        return;
    }

    // 配置目标跳转URL
    const TARGET_URL = "https://app.crystal.exchange/swap";

    // 第一步：判断路径

    // 辅助函数：等待元素出现
    function waitForElement(selector, callback, maxAttempts = 20, interval = 500) {
        return new Promise((resolve) => {
            let attempts = 0;
            const checkElement = setInterval(() => {
                const element = document.querySelector(selector);
                if (element) {
                    clearInterval(checkElement);
                    resolve(element);
                } else if (attempts >= maxAttempts) {
                    clearInterval(checkElement);
                    console.log(`未找到元素: ${selector}`);
                    resolve(null);
                } else {
                    attempts++;
                }
            }, interval);
        });
    }

    // 添加监视器来检测存款完成通知
    function watchForDepositNotification() {
        const notification = document.querySelector('.m_a49ed24.mantine-Notification-body');
        if (notification && notification.textContent.includes("Deposit completed")) {
            console.log("检测到存款完成通知，正在跳转...");
            window.location.href = TARGET_URL;
        }
    }

    // 辅助函数：随机延迟
    function randomy(min, max) {
        return new Promise(resolve => setTimeout(resolve, Math.random() * (max - min) + min));
    }

    // 模拟粘贴输入
    function simulatePaste(inputElement, inputValue) {
        inputElement.value = inputValue;
        return Promise.resolve();
    }

    // 输入文本函数
    async function inputText(selector, eventType, inputValue, isPaste = false) {
        try {
            const inputElement = await waitForElement(selector);
            if (!inputElement) {
                console.log(`Input element ${selector} not found.`);
                return false;
            }

            if (inputElement.value !== '') {
                console.log(`Input field ${selector} is not empty. Skipping input.`);
                return false;
            }

            inputElement.focus();
            await randomy(100, 300);

            if (isPaste) {
                await simulatePaste(inputElement, inputValue);
            } else {
                for (let char of inputValue.toString()) {
                    document.execCommand('insertText', false, char);
                    await randomy(50, 150);
                }
            }

            inputElement.dispatchEvent(new Event(eventType, { bubbles: true, cancelable: true }));
            await randomy(100, 300);
            inputElement.blur();

            if (inputElement.value === inputValue.toString()) {
                console.log(`Input completed for ${selector}`);
                return true;
            } else {
                console.log(`Input verification failed for ${selector}`);
                return false;
            }
        } catch (error) {
            console.error(`Error inputting text for ${selector}:`, error);
            return false;
        }
    }

    // 处理输入框和质押按钮
    async function waitForInputAndStake() {
        const inputElement = await waitForElement(
            'input.mantine-Input-input.mantine-NumberInput-input[type="text"][inputmode="numeric"]'
        );
        if (inputElement) {
            const inputValue = inputElement.value.trim();
            console.log(`当前输入框值: ${inputValue}`);

            if (!inputValue) {
                const inputSuccess = await inputText(
                    'input.mantine-Input-input.mantine-NumberInput-input[type="text"][inputmode="numeric"]',
                    'change',
                    '0.01',
                    false
                );
                if (inputSuccess) {
                    console.log("输入框处理完成，等待点击 Stake 按钮");
                    await waitForStakeButton(inputElement);
                }
            } else {
                console.log("输入框不为空，直接点击 Stake 按钮");
                await waitForStakeButton(inputElement);
            }
        } else {
            console.log("未找到输入框元素");
        }
    }

    // 处理 Stake 按钮
    async function waitForStakeButton(inputElement) {
        const stakeButton = await waitForElement(
            'button.mantine-Button-root[data-variant="gradient"][data-size="lg"]'
        );
        if (stakeButton) {
            const buttonText = stakeButton.querySelector(".mantine-Button-label");
            if (buttonText && buttonText.textContent === "Stake" && !stakeButton.disabled) {
                const currentInputValue = inputElement.value.trim();
                if (currentInputValue) {
                    console.log("输入框不为空，点击 Stake 按钮");
                    stakeButton.click();
                    watchForDepositNotification();
                } else {
                    console.log("输入框为空，无法点击 Stake 按钮");
                }
            } else {
                console.log("Stake 按钮不可用或文本不匹配");
            }
        } else {
            console.log("未找到 Stake 按钮");
        }
    }

    function scanForConnectButton() {
        const intervalId = setInterval(() => {
            const buttons = document.querySelectorAll('button');
            let initialConnectButton = null;

            for (const button of buttons) {
                const buttonLabel = button.querySelector('.mantine-Button-label');
                if (buttonLabel && buttonLabel.textContent === "Connect Wallet" && !button.disabled) {
                    initialConnectButton = button;
                    break;
                }
            }

            if (initialConnectButton) {
                console.log("定时器找到初始 'Connect Wallet' 按钮，执行点击并停止扫描");
                initialConnectButton.click();
                clearInterval(intervalId); // 找到按钮后停止定时器
                waitForMetaMaskAndStake();
            } else {
                console.log("未找到可用 'Connect Wallet' 按钮，继续扫描...");
            }
        }, 1000); // 每 1 秒扫描一次
    }

    if (window.location.href=="https://stake.apr.io/") {
        setInterval(() => {
            waitForStakeButton();
            waitForInputAndStake();
        }, 5000);
        scanForConnectButton();

        setInterval(() => {
            watchForDepositNotification();
        }, 2000);
    }

})();