function [capacity, sinr_db] = capacity_analysis(base_stations, user_locations, bandwidth_mhz)
% CAPACITY_ANALYSIS 分析网络容量和SINR
%   base_stations: Nx3 矩阵 [x, y, power_dbm]
%   user_locations: Mx2 矩阵 [x, y]
%   bandwidth_mhz: 系统带宽 (MHz)

    if nargin < 3
        bandwidth_mhz = 20;
    end

    num_users = size(user_locations, 1);
    num_bs = size(base_stations, 1);

    sinr_db = zeros(num_users, 1);
    capacity = zeros(num_users, 1);

    bandwidth_hz = bandwidth_mhz * 1e6;

    for u = 1:num_users
        ux = user_locations(u, 1);
        uy = user_locations(u, 2);

        % 计算到所有基站的接收功率
        rx_powers = zeros(num_bs, 1);
        for b = 1:num_bs
            dist = sqrt((ux - base_stations(b,1))^2 + (uy - base_stations(b,2))^2);
            freq_ghz = 2.1;
            pl = 32.45 + 20*log10(freq_ghz) + 20*log10(dist/1000 + 0.001);
            rx_powers(b) = base_stations(b, 3) - pl;
        end

        % 找到最强信号 (服务基站)
        [serving_power, serving_idx] = max(rx_powers);

        % 计算干扰 (其他基站)
        interference = sum(10.^((rx_powers(setdiff(1:num_bs, serving_idx))/10))) + 1e-12;

        % 计算SINR
        sinr_linear = 10^(serving_power/10) / interference;
        sinr_db(u) = 10*log10(sinr_linear);

        % 香农容量: C = B * log2(1 + SINR)
        capacity(u) = bandwidth_hz * log2(1 + sinr_linear) / 1e6; % Mbps
    end

    fprintf('Capacity analysis completed for %d users.\n', num_users);
    fprintf('Average SINR: %.2f dB\n', mean(sinr_db));
    fprintf('Average Capacity: %.2f Mbps\n', mean(capacity));
end
