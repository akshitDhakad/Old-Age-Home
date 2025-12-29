/**
 * Health Records Section Component
 * Complete health monitoring and records management
 */

import { useState } from 'react';
import {
  useLatestVitals,
  useHealthTrends,
  useRecordVital,
} from '../hooks/useHealth';
import { Card, Button, Input, Select, Spinner, Modal } from './';
import { HealthGraph } from './HealthGraph';
import { formatDate, formatTime } from '../utils/formatDate';
import { getErrorMessage } from '../utils/errorHandler';

export function HealthRecordsSection() {
  const queryClient = useQueryClient();
  const [selectedPeriod, setSelectedPeriod] = useState<7 | 30 | 90>(7);
  const [isRecordModalOpen, setIsRecordModalOpen] = useState(false);
  const [recordType, setRecordType] = useState<
    'blood_pressure' | 'heart_rate' | 'blood_sugar' | 'temperature' | 'weight' | 'oxygen'
  >('blood_pressure');
  const [recordValue, setRecordValue] = useState('');
  const [recordUnit, setRecordUnit] = useState('');
  const [recordNotes, setRecordNotes] = useState('');

  const { data: vitals, isLoading: vitalsLoading } = useLatestVitals();
  const { data: bpTrend } = useHealthTrends('blood_pressure', selectedPeriod);
  const { data: hrTrend } = useHealthTrends('heart_rate', selectedPeriod);
  const { data: bsTrend } = useHealthTrends('blood_sugar', selectedPeriod);
  const { data: tempTrend } = useHealthTrends('temperature', selectedPeriod);

  const recordVitalMutation = useRecordVital();
  
  const handleRecordSubmit = () => {
    if (!recordValue || !recordUnit) return;

    recordVitalMutation.mutate(
      {
        type: recordType,
        value: parseFloat(recordValue),
        unit: recordUnit,
        notes: recordNotes || undefined,
      },
      {
        onSuccess: () => {
          setIsRecordModalOpen(false);
          setRecordValue('');
          setRecordUnit('');
          setRecordNotes('');
        },
      }
    );
  };

  const handleRecordTypeChange = (type: string) => {
    setRecordType(type as any);
    // Set default units based on type
    const unitMap: Record<string, string> = {
      blood_pressure: 'mmHg',
      heart_rate: 'bpm',
      blood_sugar: 'mg/dL',
      temperature: '°F',
      weight: 'lbs',
      oxygen: '%',
    };
    setRecordUnit(unitMap[type] || '');
  };


  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Health Records</h2>
          <p className="text-sm text-gray-600 mt-1">
            Monitor and track your health vitals
          </p>
        </div>
        <div className="flex gap-3">
          <Select
            value={selectedPeriod.toString()}
            onChange={(e) => setSelectedPeriod(parseInt(e.target.value) as 7 | 30 | 90)}
            options={[
              { value: '7', label: 'Last 7 Days' },
              { value: '30', label: 'Last 30 Days' },
              { value: '90', label: 'Last 90 Days' },
            ]}
          />
          <Button onClick={() => setIsRecordModalOpen(true)}>
            Record Vital
          </Button>
        </div>
      </div>

      {/* Current Vitals */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {vitalsLoading ? (
          <div className="col-span-4 flex justify-center p-8">
            <Spinner />
          </div>
        ) : (
          <>
            {vitals?.find((v) => v.type === 'blood_pressure') && (
              <Card className="bg-gradient-to-br from-red-500 to-red-600 text-white border-none shadow-lg">
                <p className="text-red-100 text-sm">Blood Pressure</p>
                <p className="text-3xl font-bold mt-2">
                  {vitals.find((v) => v.type === 'blood_pressure')?.value || 'N/A'}
                </p>
                <p className="text-red-100 text-xs mt-1">
                  {vitals.find((v) => v.type === 'blood_pressure')?.unit || 'mmHg'}
                  {vitals.find((v) => v.type === 'blood_pressure')?.timestamp &&
                    ` • ${formatTime(vitals.find((v) => v.type === 'blood_pressure')!.timestamp)}`}
                </p>
              </Card>
            )}
            {vitals?.find((v) => v.type === 'heart_rate') && (
              <Card className="bg-gradient-to-br from-pink-500 to-pink-600 text-white border-none shadow-lg">
                <p className="text-pink-100 text-sm">Heart Rate</p>
                <p className="text-3xl font-bold mt-2">
                  {vitals.find((v) => v.type === 'heart_rate')?.value || 'N/A'}
                </p>
                <p className="text-pink-100 text-xs mt-1">
                  {vitals.find((v) => v.type === 'heart_rate')?.unit || 'bpm'}
                  {vitals.find((v) => v.type === 'heart_rate')?.timestamp &&
                    ` • ${formatTime(vitals.find((v) => v.type === 'heart_rate')!.timestamp)}`}
                </p>
              </Card>
            )}
            {vitals?.find((v) => v.type === 'blood_sugar') && (
              <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-none shadow-lg">
                <p className="text-blue-100 text-sm">Blood Sugar</p>
                <p className="text-3xl font-bold mt-2">
                  {vitals.find((v) => v.type === 'blood_sugar')?.value || 'N/A'}
                </p>
                <p className="text-blue-100 text-xs mt-1">
                  {vitals.find((v) => v.type === 'blood_sugar')?.unit || 'mg/dL'}
                  {vitals.find((v) => v.type === 'blood_sugar')?.timestamp &&
                    ` • ${formatTime(vitals.find((v) => v.type === 'blood_sugar')!.timestamp)}`}
                </p>
              </Card>
            )}
            {vitals?.find((v) => v.type === 'temperature') && (
              <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-none shadow-lg">
                <p className="text-purple-100 text-sm">Temperature</p>
                <p className="text-3xl font-bold mt-2">
                  {vitals.find((v) => v.type === 'temperature')?.value || 'N/A'}
                </p>
                <p className="text-purple-100 text-xs mt-1">
                  {vitals.find((v) => v.type === 'temperature')?.unit || '°F'}
                  {vitals.find((v) => v.type === 'temperature')?.timestamp &&
                    ` • ${formatTime(vitals.find((v) => v.type === 'temperature')!.timestamp)}`}
                </p>
              </Card>
            )}
          </>
        )}
      </div>

      {/* Health Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {bpTrend && (
          <Card>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Blood Pressure Trend ({selectedPeriod} Days)
              </h3>
              <span
                className={`text-sm font-medium ${
                  bpTrend.trend === 'improving'
                    ? 'text-green-600'
                    : bpTrend.trend === 'declining'
                      ? 'text-red-600'
                      : 'text-blue-600'
                }`}
              >
                {bpTrend.trend === 'improving'
                  ? '↓ Improving'
                  : bpTrend.trend === 'declining'
                    ? '↑ Declining'
                    : '→ Stable'}
              </span>
            </div>
            <HealthGraph trend={bpTrend} color="red" height={200} />
            <div className="mt-4 text-center">
              <p className="text-sm text-gray-600">
                Average:{' '}
                <span className="font-semibold text-gray-900">
                  {bpTrend.average} mmHg
                </span>
              </p>
            </div>
          </Card>
        )}

        {hrTrend && (
          <Card>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Heart Rate Trend ({selectedPeriod} Days)
              </h3>
              <span
                className={`text-sm font-medium ${
                  hrTrend.trend === 'improving'
                    ? 'text-green-600'
                    : hrTrend.trend === 'declining'
                      ? 'text-red-600'
                      : 'text-blue-600'
                }`}
              >
                {hrTrend.trend === 'improving'
                  ? '↓ Improving'
                  : hrTrend.trend === 'declining'
                    ? '↑ Declining'
                    : '→ Stable'}
              </span>
            </div>
            <HealthGraph trend={hrTrend} color="blue" height={200} />
            <div className="mt-4 text-center">
              <p className="text-sm text-gray-600">
                Average:{' '}
                <span className="font-semibold text-gray-900">
                  {hrTrend.average} bpm
                </span>
              </p>
            </div>
          </Card>
        )}

        {bsTrend && (
          <Card>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Blood Sugar Trend ({selectedPeriod} Days)
              </h3>
              <span
                className={`text-sm font-medium ${
                  bsTrend.trend === 'improving'
                    ? 'text-green-600'
                    : bsTrend.trend === 'declining'
                      ? 'text-red-600'
                      : 'text-blue-600'
                }`}
              >
                {bsTrend.trend === 'improving'
                  ? '↓ Improving'
                  : bsTrend.trend === 'declining'
                    ? '↑ Declining'
                    : '→ Stable'}
              </span>
            </div>
            <HealthGraph trend={bsTrend} color="green" height={200} />
            <div className="mt-4 text-center">
              <p className="text-sm text-gray-600">
                Average:{' '}
                <span className="font-semibold text-gray-900">
                  {bsTrend.average} mg/dL
                </span>
              </p>
            </div>
          </Card>
        )}

        {tempTrend && (
          <Card>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Temperature Trend ({selectedPeriod} Days)
              </h3>
              <span
                className={`text-sm font-medium ${
                  tempTrend.trend === 'improving'
                    ? 'text-green-600'
                    : tempTrend.trend === 'declining'
                      ? 'text-red-600'
                      : 'text-blue-600'
                }`}
              >
                {tempTrend.trend === 'improving'
                  ? '↓ Improving'
                  : tempTrend.trend === 'declining'
                    ? '↑ Declining'
                    : '→ Stable'}
              </span>
            </div>
            <HealthGraph trend={tempTrend} color="purple" height={200} />
            <div className="mt-4 text-center">
              <p className="text-sm text-gray-600">
                Average:{' '}
                <span className="font-semibold text-gray-900">
                  {tempTrend.average}°F
                </span>
              </p>
            </div>
          </Card>
        )}
      </div>

      {/* Record Vital Modal */}
      <Modal
        isOpen={isRecordModalOpen}
        onClose={() => setIsRecordModalOpen(false)}
        title="Record Health Vital"
      >
        <div className="space-y-4">
          <Select
            label="Vital Type"
            value={recordType}
            onChange={(e) => handleRecordTypeChange(e.target.value)}
            options={[
              { value: 'blood_pressure', label: 'Blood Pressure' },
              { value: 'heart_rate', label: 'Heart Rate' },
              { value: 'blood_sugar', label: 'Blood Sugar' },
              { value: 'temperature', label: 'Temperature' },
              { value: 'weight', label: 'Weight' },
              { value: 'oxygen', label: 'Oxygen Saturation' },
            ]}
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Value"
              type="number"
              step="0.1"
              value={recordValue}
              onChange={(e) => setRecordValue(e.target.value)}
              placeholder="Enter value"
              required
            />
            <Input
              label="Unit"
              value={recordUnit}
              onChange={(e) => setRecordUnit(e.target.value)}
              placeholder="Unit"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notes (Optional)
            </label>
            <textarea
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
              rows={3}
              placeholder="Any additional notes..."
              value={recordNotes}
              onChange={(e) => setRecordNotes(e.target.value)}
            />
          </div>

          {recordVitalMutation.error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">
                {getErrorMessage(recordVitalMutation.error)}
              </p>
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              onClick={() => setIsRecordModalOpen(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleRecordSubmit}
              disabled={!recordValue || !recordUnit || recordVitalMutation.isPending}
              className="flex-1"
            >
              {recordVitalMutation.isPending ? (
                <>
                  <Spinner size="sm" className="mr-2" />
                  Recording...
                </>
              ) : (
                'Record Vital'
              )}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

