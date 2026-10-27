import { describe, test, expect, vi, beforeEach } from 'vitest';
import { fetchProperties } from '../api/client';

const mockFetch = vi.fn();

global.fetch = mockFetch; 

describe ('fetchProperties', () => {
    beforeEach(() => {
        mockFetch.mockClear();
    });

    test('fetch property', async () => {
        const mockProperty = {
            "total": 1,
            "limit": 20,
            "offset": 0,
            "results": [
                {
                    "id": 53,
                    "L_Address": "1461 Laurel Way",
                    "L_Zip": "90210",
                    "L_City": "Beverly Hills",
                    "L_State": "CA",
                    "L_Keyword2": 4,
                    "LM_Dec_3": "5.0",
                    "L_Photos": "[\"https:\\/\\/api.cotality.com\\/trestle\\/Media\\/Property\\/PHOTO-Jpeg\\/1118422731\\/1\\/ODU2My84NTc1LzIw\\/MjAvMTcwMjMvMTc3MjA2NjExMw\\/cGeYQA5hMtpUUK6yvoMfzw6SXcrMKq52GCkruPW_yBY\",\"https:\\/\\/api.cotality.com\\/trestle\\/Media\\/Property\\/PHOTO-Jpeg\\/1118422731\\/2\\/ODU2My84NTc1LzIw\\/MjAvMTcwMjMvMTc3MjA2NjExMw\\/D9UAqcXIwS9KMPZHBzEaG4MW-GPxhNmvggWO8ZfAz-E\",\"https:\\/\\/api.cotality.com\\/trestle\\/Media\\/Property\\/PHOTO-Jpeg\\/1118422731\\/3\\/ODU2My84NTc1LzIw\\/MjAvMTcwMjMvMTc3MjA2NjExMw\\/rQ1QluuOnl2V4xF6HcXKPOW0-rzr7J6Q1EqBRslqPVo\",\"https:\\/\\/api.cotality.com\\/trestle\\/Media\\/Property\\/PHOTO-Jpeg\\/1118422731\\/4\\/ODU2My84NTc1LzIw\\/MjAvMTcwMjMvMTc3MjA2NjExMw\\/6I5Hcq3CFjFlexbaLRlu8mTFoyx_PQixnTrB2fHexaY\",\"https:\\/\\/api.cotality.com\\/trestle\\/Media\\/Property\\/PHOTO-Jpeg\\/1118422731\\/5\\/ODU2My84NTc1LzIw\\/MjAvMTcwMjMvMTc3MjA2NjExMw\\/M5fYj4T19_5em_TF0Sz4z7tbUCrx28tuchoUlwRmNx4\",\"https:\\/\\/api.cotality.com\\/trestle\\/Media\\/Property\\/PHOTO-Jpeg\\/1118422731\\/6\\/ODU2My84NTc1LzIw\\/MjAvMTcwMjMvMTc3MjA2NjExMw\\/DZx1Bagq_UUMvzWta9oSocxSlM0DX13u4a5dvy4Kv3s\",\"https:\\/\\/api.cotality.com\\/trestle\\/Media\\/Property\\/PHOTO-Jpeg\\/1118422731\\/7\\/ODU2My84NTc1LzIw\\/MjAvMTcwMjMvMTc3MjA2NjExMw\\/54TGT9MXM-49GtfijnIZInCdkQdWa2QoX6uP7zJpdaQ\",\"https:\\/\\/api.cotality.com\\/trestle\\/Media\\/Property\\/PHOTO-Jpeg\\/1118422731\\/8\\/ODU2My84NTc1LzIw\\/MjAvMTcwMjMvMTc3MjA2NjExMw\\/X9PDGRGZjE0XLcQ9-mZ5z2kEQkDh72_sd5XxG5Pvmf8\",\"https:\\/\\/api.cotality.com\\/trestle\\/Media\\/Property\\/PHOTO-Jpeg\\/1118422731\\/9\\/ODU2My84NTc1LzIw\\/MjAvMTcwMjMvMTc3MjA2NjExMw\\/lDNnfB-T4mi8a0Qxp4P9Vgz_c8KgOx-hDEXxE1n0FZ8\"]",
                }]
        };

        mockFetch.mockResolvedValueOnce({
            status: 200,
            json: () => Promise.resolve(mockProperty),
        });

        const propertyData = await fetchProperties('');

        expect(mockFetch).toHaveBeenCalledTimes(1);
        expect(mockFetch).toHaveBeenCalledWith('/api/properties?');
        expect(propertyData).toEqual(mockProperty);
    })

    test('handle API errors', async () => {
        mockFetch.mockResolvedValueOnce({
            status: 400,
            json: () => Promise.resolve({ message: 'Bad Request' })
        });

        await expect(fetchProperties('error')).rejects.toThrow('Failed to fetch properties. \nStatus: 400.');
        expect(mockFetch).toHaveBeenCalledTimes(1);
        expect(mockFetch).toHaveBeenCalledWith('/api/properties?error');
    })

    test('handle network failures', async () => {
        const networkError = new TypeError('Failed to fetch.');

        mockFetch.mockRejectedValueOnce(networkError);

        await expect(fetchProperties('network error')).rejects.toThrow(networkError);
        expect(mockFetch).toHaveBeenCalledTimes(1);
        expect(mockFetch).toHaveBeenCalledWith('/api/properties?network error');
    })
})