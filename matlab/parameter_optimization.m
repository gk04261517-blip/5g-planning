function [optimal_params, best_coverage] = parameter_optimization(area_size, num_bs, iterations)
% PARAMETER_OPTIMIZATION 优化基站部署参数
%   area_size: [width, height] 区域大小
%   num_bs: 基站数量
%   iterations: 优化迭代次数

    if nargin < 3
        iterations = 100;
    end

    width = area_size(1);
    height = area_size(2);

    % 初始化随机基站位置
    best_params = [rand(num_bs, 2) .* [width, height], ones(num_bs, 1) * 46]; % 46 dBm 默认功率
    best_coverage = 0;

    % 模拟退火优化
    temperature = 1000;
    cooling_rate = 0.95;

    for iter = 1:iterations
        % 生成新解 (在当前解附近扰动)
        new_params = best_params;
        for b = 1:num_bs
            new_params(b, 1) = max(0, min(width, new_params(b, 1) + normrnd(0, width/20)));
            new_params(b, 2) = max(0, min(height, new_params(b, 2) + normrnd(0, height/20)));
        end

        % 评估覆盖率
        [cov_map, ~, ~] = coverage_prediction(new_params, 100, 3000);
        coverage_rate = mean(cov_map(:));

        % 接受准则
        if coverage_rate > best_coverage
            best_params = new_params;
            best_coverage = coverage_rate;
        elseif rand() < exp((coverage_rate - best_coverage) * 100 / temperature)
            best_params = new_params;
            best_coverage = coverage_rate;
        end

        temperature = temperature * cooling_rate;

        if mod(iter, 10) == 0
            fprintf('Iteration %d: Coverage = %.2f%%\n', iter, best_coverage * 100);
        end
    end

    optimal_params = best_params;
    fprintf('Optimization completed. Best coverage: %.2f%%\n', best_coverage * 100);
end
