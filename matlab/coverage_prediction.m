function [coverage_map, x_grid, y_grid] = coverage_prediction(base_stations, resolution, max_distance)
% COVERAGE_PREDICTION 预测基站覆盖范围
%   base_stations: Nx3 矩阵 [x, y, power_dbm]
%   resolution: 网格分辨率 (米)
%   max_distance: 最大计算距离 (米)

    if nargin < 2
        resolution = 50;
    end
    if nargin < 3
        max_distance = 5000;
    end

    % 确定仿真区域
    min_x = min(base_stations(:,1)) - max_distance;
    max_x = max(base_stations(:,1)) + max_distance;
    min_y = min(base_stations(:,2)) - max_distance;
    max_y = max(base_stations(:,2)) + max_distance;

    % 创建网格
    x_grid = min_x:resolution:max_x;
    y_grid = min_y:resolution:max_y;
    [X, Y] = meshgrid(x_grid, y_grid);

    % 初始化覆盖地图 (最大接收功率)
    coverage_map = -inf(size(X));

    % 对每个基站计算接收功率
    for i = 1:size(base_stations, 1)
        bs_x = base_stations(i, 1);
        bs_y = base_stations(i, 2);
        tx_power = base_stations(i, 3);

        % 计算距离
        dist = sqrt((X - bs_x).^2 + (Y - bs_y).^2);

        % 自由空间路径损耗 + 简单阴影衰落模型
        % PL(d) = 32.45 + 20*log10(f) + 20*log10(d) + shadowing
        % 假设频率 2.1 GHz
        freq_ghz = 2.1;
        pl = 32.45 + 20*log10(freq_ghz) + 20*log10(dist/1000 + 0.001);

        % 添加对数正态阴影衰落
        shadowing_std = 8; % dB
        shadowing = shadowing_std * randn(size(X));

        rx_power = tx_power - pl + shadowing;

        % 更新最大接收功率
        coverage_map = max(coverage_map, rx_power);
    end

    % 转换为覆盖概率 (假设 -110 dBm 为灵敏度阈值)
    sensitivity = -110;
    coverage_map = coverage_map > sensitivity;

    fprintf('Coverage prediction completed. Grid size: %dx%d\n', size(coverage_map, 1), size(coverage_map, 2));
end
